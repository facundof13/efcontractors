var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
const invoice = db.collection('invoices');
var ObjectId = require('mongodb').ObjectID;

function getServices() {
  return ["Haul Off", "Demolition", "Tile", "Fence" ]
}

module.exports = {
  getServices,
}