var mongoUtil = require("../mongoUtil");
var db = mongoUtil.getDb();
const invoices = db.collection("invoices");
var ObjectId = require("mongodb").ObjectID;

function getServices() {
  // return ["Haul Off", "Demolition", "Tile", "Fence" ]
  return new Promise((resolve, reject) => {
    invoices.find({ Name: "Invoice Services" }).toArray((err, items) => {
      // console.log(items)
      resolve(items[0].Items);
    });
  });
}

function getInvoiceCustomers() {
  return new Promise((resolve, reject) => {
    invoices
      .find({ "Name": {"$exists": false} })
      .toArray((err, items) => {
        console.log(items);
        resolve(items)
      });
  });
}
function addInvoiceCustomer(query) {
  invoices.insertOne(query, (err, res) =>
    console.log(`Added doc id ${res.ops[0]._id} to db`)
  );
}
module.exports = {
  getServices,
  addInvoiceCustomer,
  getInvoiceCustomers
};
