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
    invoices.find({ Name: { $exists: false } }).toArray((err, items) => {
      resolve(items);
    });
  });
}
function addInvoiceCustomer(query) {
  invoices.insertOne(query, (err, res) =>
    console.log(`Added doc id ${res.ops[0]._id} to db`)
  );
}

function addEstimateToCustomer(id, query) {
  console.log(id)
  console.log(query)
  invoices.updateOne(
    { _id: ObjectId(id) },
    {
      $push: {estimates: query}
    },
    (err, item) => {
      console.log(`Updated customer ${id}`);
    }
  );
}

function deleteCustomer(id) {
  invoices.deleteOne({ _id: ObjectId(id) }, (err, results) => {});
}

function updateCustomer(id, query) {
  console.log(id)
  console.log(query)

  invoices.updateOne(
    {
      _id: ObjectId(id)
    },
    {
      $set: {
      name: query.name,
      address: query.address,
      cityState: query.cityState,
      zip: query.zip,
      email: query.email,
      date: query.date,
      phone: query.phone
      }
    },
    (err, item) => {
      console.log(`Updated customer ${id}`);
    }
  );
}

module.exports = {
  getServices,
  addInvoiceCustomer,
  getInvoiceCustomers,
  deleteCustomer,
  updateCustomer,
  addEstimateToCustomer,
};
