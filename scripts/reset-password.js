// One-off password reset helper.
// Usage:  node scripts/reset-password.js <username> <newPassword>
// Generates a bcrypt hash (matching how models/users.js creates users) and
// updates that user's password in MongoDB.
require("dotenv").config();
var bcrypt = require("bcrypt");
var mongoUtil = require("../mongoUtil");

var username = process.argv[2];
var newPassword = process.argv[3];

if (!username || !newPassword) {
  console.error("Usage: node scripts/reset-password.js <username> <newPassword>");
  process.exit(1);
}

mongoUtil.connectToServer(function (err, client) {
  if (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
  var db = mongoUtil.getDb();
  bcrypt.hash(newPassword, 10, function (err, hash) {
    if (err) throw err;
    db.collection("users").updateOne(
      { username: username },
      { $set: { password: hash } },
      function (err, res) {
        if (err) throw err;
        if (res.matchedCount === 0) {
          console.error('No user found with username "' + username + '".');
        } else {
          console.log('Password updated for "' + username + '".');
        }
        process.exit(0);
      }
    );
  });
});
