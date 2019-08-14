var mongoUtil = require("../mongoUtil");
var db = mongoUtil.getDb();
const settings = db.collection("settings");
var ObjectId = require("mongodb").ObjectID;

function getSettings() {
  return new Promise((resolve, reject) => {
    settings
      .find({ _id: ObjectId("5d52e0b01c9d4400007da34b") })
      .toArray((err, items) => {
        resolve(items);
      });
  });
}

function getInvoiceSettings() {
  return new Promise((r, rej) => {
    settings
      .find({ _id: ObjectId("5d545e511c9d4400000cb716") })
      .toArray((e, items) => {
        r(items);
      });
  });
}

function updateSettings(query) {
  settings.updateOne(
    {
      _id: ObjectId("5d52e0b01c9d4400007da34b")
    },
    {
      $set: query
    },
    (err, item) => {
      console.log(`Updated settings.`);
    }
  );
}

function updateInvoiceSettings(query) {
  settings.updateOne(
    {
      _id: ObjectId("5d545e511c9d4400000cb716")
    },
    {
      $set: query
    },
    (err, item) => {
      console.log(`Updated settings.`);
    }
  );
}

module.exports = { getSettings, updateSettings, getInvoiceSettings,updateInvoiceSettings };
