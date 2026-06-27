// Backfill thumbnails for existing project images that don't have one yet.
//
// For every image (not video) in every project that lacks `thumbUrl`, this
// downloads the original from S3, makes a small JPEG thumbnail with jimp, uploads
// it next to the original, and sets `thumbUrl` on the record. Videos are skipped
// (their thumbnails are generated in the browser at upload time).
//
// Usage:
//   node scripts/backfill-thumbnails.js          # dry run — reports, writes nothing
//   node scripts/backfill-thumbnails.js --apply  # actually create thumbs + update DB
require("dotenv").config();
var Jimp = require("jimp");
var mongoUtil = require("../mongoUtil");
var s3 = require("../aws");

var BUCKET = "efcontractors";
var BASE_URL = "https://efcontractors.s3.us-east-2.amazonaws.com/";
var MAX_DIM = 400;
var APPLY = process.argv.includes("--apply");

function keyFromUrl(url) {
  // works for both the regional and global S3 host forms
  var parts = url.split(".amazonaws.com/");
  return parts.length > 1 ? parts[1] : null;
}

function thumbKey(key) {
  return key.replace(/\.[^.]+$/, "thumb.jpg");
}

function isVideo(url) {
  return /\.(mp4|mov|m4v)$/i.test(url);
}

async function makeThumb(key) {
  var obj = await s3.getObject({ Bucket: BUCKET, Key: key }).promise();
  var image = await Jimp.read(obj.Body);
  image.scaleToFit(MAX_DIM, MAX_DIM).quality(70);
  return image.getBufferAsync(Jimp.MIME_JPEG);
}

async function run() {
  await new Promise(function (resolve, reject) {
    mongoUtil.connectToServer(function (err) {
      err ? reject(err) : resolve();
    });
  });
  var db = mongoUtil.getDb();
  var projects = await db.collection("projects").find({}).toArray();

  var stats = { projects: 0, thumbed: 0, skipped: 0, errors: 0 };

  for (var project of projects) {
    if (!Array.isArray(project.images)) continue;
    var changed = false;
    var newImages = [];

    for (var img of project.images) {
      if (!img || !img.url || img.thumbUrl || isVideo(img.url)) {
        // already has a thumb, is a video, or malformed — leave as-is
        newImages.push(img);
        continue;
      }
      var key = keyFromUrl(img.url);
      if (!key) {
        stats.skipped++;
        newImages.push(img);
        continue;
      }
      var tKey = thumbKey(key);
      var tUrl = BASE_URL + tKey;

      if (!APPLY) {
        console.log("  [dry-run] would create " + tKey);
        newImages.push(Object.assign({}, img, { thumbUrl: tUrl }));
        changed = true;
        stats.thumbed++;
        continue;
      }

      try {
        var buf = await makeThumb(key);
        await s3
          .putObject({
            Bucket: BUCKET,
            Key: tKey,
            Body: buf,
            ContentType: "image/jpeg",
            ACL: "public-read",
          })
          .promise();
        newImages.push(Object.assign({}, img, { thumbUrl: tUrl }));
        changed = true;
        stats.thumbed++;
        console.log("  created " + tKey);
      } catch (e) {
        stats.errors++;
        newImages.push(img);
        console.log("  ERROR on " + key + ": " + e.message);
      }
    }

    if (changed) {
      stats.projects++;
      if (APPLY) {
        await db
          .collection("projects")
          .updateOne({ _id: project._id }, { $set: { images: newImages } });
      }
    }
  }

  console.log("\n" + (APPLY ? "APPLIED" : "DRY RUN") + " summary:", stats);
  if (!APPLY) console.log("Re-run with --apply to create thumbnails.");
  process.exit(0);
}

run().catch(function (e) {
  console.error(e);
  process.exit(1);
});
