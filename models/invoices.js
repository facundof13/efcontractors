var mongoUtil = require("../mongoUtil");
var db = mongoUtil.getDb();
const invoices = db.collection("invoices");
var ObjectId = require("mongodb").ObjectID;

function compareDates(date1, date2) {
  let newDate1 = new Date(date1);
  let newDate2 = new Date(date2);

  return newDate1.getTime() === newDate2.getTime();
}

function getServices() {
  return new Promise((resolve, reject) => {
    invoices
      .find({ _id: ObjectId("5d2e983f1c9d4400005a4e5a") })
      .toArray((err, items) => {
        console.log(items);
        resolve(items[0].services);
      });
  });
}

function sendEmail(query) {
  console.log(query.client, query.estimate)
  var email = require("emailjs");
  var server = email.server.connect({
    user: "facundof13@gmail.com",
    password: "orxatnfsxtdrwnsl",
    host: "smtp.gmail.com",
    ssl: true
  });
  // console.log(query);
  // console.log(Email)
  let estimateOrInvoiceOrReceipt = query.estimate.paid ? "a receipt" : query.estimate.invoice ? "an invoice" : "an estimate"
  server
    .send({
      text: `Estimate Number: ${query.estimate.estimateNum}\nTotal: $${query.estimate.total.toLocaleString('en-US', {type:'currency',currency:'USD'})}\n\nEFContractors LLC has prepared ${estimateOrInvoiceOrReceipt}. Your document has been attached below. \n\n\nIf you have any issues or questions please contact us directly.\n\nThank you for your business!\n\n\EFContractors LLC`,
      from: "info@efcontractorsllc.com",
      to: query.client.email,
      subject: "EF Contractors LLC",
      attachment: [
        {
          name: "Estimate.pdf",
          type:'application/pdf',
          data: query.pdf.replace('data:application/pdf;base64,', ''),
          encoded: true,
        }
      ]
    }, (err, msg) => {
      console.log(err || msg)
    })
}

function getInvoiceCustomers() {
  return new Promise((resolve, reject) => {
    invoices.find({ Name: { $exists: false } }).toArray((err, items) => {
      resolve(items);
    });
  });
}
function addInvoiceCustomer(query) {
  console.log(query);
  invoices.insertOne(query, (err, res) =>
    console.log(`Added doc id ${res.ops[0]._id} to db`)
  );
}

function addEstimateToCustomer(id, query) {
  console.log(id);
  console.log(query);
  invoices.updateOne(
    { _id: ObjectId(id) },
    {
      $push: { estimates: query }
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
  console.log(id);
  console.log(query);

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

function updateEstimate(query) {
  console.log(query);
  return new Promise((resolve, reject) => {
    invoices.updateOne(
      {
        "estimates.date": query.date
      },
      {
        $set: {
          "estimates.$": query
        }
      }
    );
    resolve();
  });
}

function deleteEstimate(id, query) {
  console.log(id, query);
  invoices.updateOne(
    { _id: ObjectId(id) },
    { $pull: { estimates: { date: query.date } } }
  );
}

function getLogoURI() {
  return new Promise((resolve, reject) => {
    invoices
      .find({ _id: ObjectId("5d4084761c9d440000bbf98f") })
      .toArray((err, items) => {
        resolve(items);
      });
  });
}

function getCurrentEstimateNum() {
  return new Promise((resolve, reject) => {
    invoices
      .find({ _id: ObjectId("5d41ec9b1c9d44000046c695") })
      .toArray((err, items) => {
        resolve(items[0].estimateNum);
      });
  });
}

function incrementEstimateNum() {
  getCurrentEstimateNum().then(res => {
    invoices.updateOne(
      { _id: ObjectId("5d41ec9b1c9d44000046c695") },
      {
        $inc: {
          estimateNum: 1
        }
      }
    );
  });
}

module.exports = {
  getServices,
  addInvoiceCustomer,
  getInvoiceCustomers,
  deleteCustomer,
  updateCustomer,
  addEstimateToCustomer,
  updateEstimate,
  deleteEstimate,
  getLogoURI,
  getCurrentEstimateNum,
  incrementEstimateNum,
  sendEmail
};
