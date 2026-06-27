// Restore the `projects` collection from a backup made by backup-projects.js.
// Replaces each project document by _id (so it undoes the thumbnail backfill).
//
// Usage: node scripts/restore-projects.js backups/projects-<stamp>.json
require("dotenv").config();
var fs = require("fs");
var mongoUtil = require("../mongoUtil");
var ObjectId = require("mongodb").ObjectID;

var file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/restore-projects.js <backup-file.json>");
  process.exit(1);
}

async function run() {
  var docs = JSON.parse(fs.readFileSync(file, "utf8"));
  await new Promise(function (resolve, reject) {
    mongoUtil.connectToServer(function (err) {
      err ? reject(err) : resolve();
    });
  });
  var db = mongoUtil.getDb();
  var col = db.collection("projects");

  var restored = 0;
  for (var doc of docs) {
    var id = doc._id;
    var copy = Object.assign({}, doc);
    delete copy._id;
    await col.replaceOne({ _id: ObjectId(id) }, copy, { upsert: true });
    restored++;
  }
  console.log("Restored " + restored + " projects from " + file);
  process.exit(0);
}

run().catch(function (e) {
  console.error(e);
  process.exit(1);
});
