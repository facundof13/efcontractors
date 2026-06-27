// Read-only snapshot of the `projects` collection to a local JSON file, so the
// thumbnail backfill can be rolled back if needed. Restore with restore-projects.js.
//
// Usage: node scripts/backup-projects.js
require("dotenv").config();
var fs = require("fs");
var path = require("path");
var mongoUtil = require("../mongoUtil");

async function run() {
  await new Promise(function (resolve, reject) {
    mongoUtil.connectToServer(function (err) {
      err ? reject(err) : resolve();
    });
  });
  var db = mongoUtil.getDb();
  var docs = await db.collection("projects").find({}).toArray();

  var dir = path.join(__dirname, "..", "backups");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  var stamp = new Date().toISOString().replace(/[:.]/g, "-");
  var file = path.join(dir, "projects-" + stamp + ".json");
  fs.writeFileSync(file, JSON.stringify(docs, null, 2));

  console.log("Backed up " + docs.length + " projects to:");
  console.log(file);
  process.exit(0);
}

run().catch(function (e) {
  console.error(e);
  process.exit(1);
});
