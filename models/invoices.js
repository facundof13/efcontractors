var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
const invoices = db.collection('invoices');
var ObjectId = require('mongodb').ObjectID;

function getServices() {
  // return ["Haul Off", "Demolition", "Tile", "Fence" ]
    return new Promise((resolve, reject) => {
      invoices.find({})
      .toArray((err, items) => {
        resolve(items[0].Items);
      });
    });
  }

module.exports = {
  getServices,
}