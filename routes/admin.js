var express = require("express");
var router = express.Router();
var services = require("../models/services.js");
var testimonials = require("../models/testimonials.js");
var projects = require("../models/projects");
var invoices = require("../models/invoices");
var settings = require("../models/settings");
const titleize = require("titleize");
const moment = require("moment");
const pdfgenerator = require("../models/pdfgenerator");

// TODO: Refactor/clean up admin.js

/* GET admins listing. */

// router.all('/*', (req, res, next) => {
//   if (!req.session.passport || !req.session.passport.user)
//     return res.status(401).json({
//       status: "Please log in"
//     });
//   return next();
// })

router.post("/sendemail", function(req, res, next) {
  invoices.sendEmail(req.body);
  res.end();
});

router.get("/testimonials", function(req, res, next) {
  testimonials.getAllTestimonials().then(testimonials => {
    res.json(testimonials);
  });
});

// delete testimonial
router.delete("/testimonials", function(req, res, next) {
  testimonials.removeTestimonial(req.body.id);
  res.end();
});

// update testimonials
router.post("/updatetestimonials", function(req, res, next) {
  console.log(req.body);
  req.body.testimonials.map(testimonial => {
    let query = {
      text: testimonial.text,
      name: testimonial.name,
      cityState: testimonial.cityState,
      verified: testimonial.verified,
      insertedDate: testimonial.insertedDate
    };
    testimonials.updateTestimonial(testimonial._id, query);
  });
  res.end();
});

router.get("/settings", function(req, res, next) {
  settings.getSettings().then(settings => {
    res.json(settings[0]);
  });
});

router.get('/invoicesettings', function (req, res, next) {
  settings.getInvoiceSettings().then(settings => {
    res.json(settings[0])
  })
})

router.post('/settings', function(req, res, next) {
  settings.updateSettings(req.body.settings)
  // console.log(req.body.settings)
  res.end()
})

router.post('/invoicesettings', function(req, res, next) {
  settings.updateInvoiceSettings(req.body.settings)
  // console.log(req.body.settings)
  res.end()
})

//add service
router.post("/addservices", function(
  req,
  res,
  next
) {
  // query = {
  // Service: "Roofing",
  // Residential: 1,
  // Commercial: 0
  // }

  query = {
    Service: req.body.Service,
    Residential: req.body.Residential,
    Commercial: req.body.Commercial
  };
  console.log(query)
  services.addService(query);
  res.end();
});

//delete service
router.delete("/services", function(req, res, next) {
  services.removeService(req.body._id);
  res.end();
});

//update service
router.post(
  "/services",
  function(req, res, next) {
    let query = {Service: req.body.Service, Residential: req.body.Residential, Commercial: req.body.Commercial }
    console.log(query)
    services.updateService(req.body._id, query);
    res.end();
  }
);

/// admin/projects
router.get("/projects", function(req, res, next) {
  projects.getAllProjects().then(items => {
    res.json(items);
  });
});

router.get("/projectname", async function(req, res, next) {
  const result = await projects.getProjectById(req.query.id);
  res.json(result);
});

// admin/newproject
router.post("/newproject", async function(req, res, next) {
  const name = req.body.name;
  const location = req.body.location;
  query = {
    name: name,
    location: location,
    images: []
  };

  if (
    //check if strings are empty or undefined
    name === "" ||
    name === undefined ||
    location === "" ||
    location === undefined
  ) {
    res.json({ error: `Project cannot have an empty name/location` });
  } else {
    projects.addProject(query);
    res.sendStatus(200);
    // add project to db
    //check if s3 has a folder with project
    // const matchingFolder = await projects.findMatchingFolder(name + "/");
    res.end();
  }
});

router.delete("/deleteimg", function(req, res, next) {
  const id = req.body.id;
  const imagesrc = req.body.image;

  projects.removeImageFromFolder(id, imagesrc);
  path = imagesrc.replace(/.+amazonaws.com\//g, "");
  console.log(`path:${path}`);
  projects.deleteImageFromS3(path);
  res.end();
});

router.delete("/deleteproject", function(req, res, next) {
  const id = req.body.id;
  console.log(id);
  projects.deleteEntireProject(id);
  res.end();
});

router.get("/invoiceServices", async function(req, res, next) {
  invoices.getServices().then(item => {
    res.json(item);
  });
});

router.get("/invoiceCustomers", async function(req, res, next) {
  invoices.getInvoiceCustomers().then(items => {
    res.json(items);
    // res.end()
  });
});

router.delete("/invoiceCustomerId", function(req, res, next) {
  invoices.deleteCustomer(req.body.id);
  res.end();
});

router.post("/invoiceupdate", function(req, res, next) {
  let total = 0;
  req.body.items.forEach(item => {
    total += Number(item.amount.replace("$", "")) * Number(item.quantity);
  });

  let query = {
    expiration: req.body.expiration,
    title:  titleize(req.body.title),
    items: req.body.items,
    date: req.body.date,
    total: total,
    contractSpecs: req.body.contractSpecs,
    invoice: req.body.invoice,
    attachContract: req.body.attachContract,
    paymentSteps: req.body.paymentSteps,
    paid: req.body.paid,
    pdfLink: req.body.pdfLink,
    estimateNum: req.body.estimateNum,
    paidDate: req.body.paidDate
  };

  invoices.addEstimateToCustomer(req.body.id, query);
  res.end();
});

router.post("/invoice", function(req, res, next) {
  let items = req.body.items;

  let total = 0;
  items.forEach(item => {
    total += Number(item.amount.replace("$", "")) * Number(item.quantity);
  });

  let estimate = {
    items: req.body.items,
    total: total,
    expiration: req.body.expiration,
    title: titleize(req.body.title),
    date: req.body.dateSubmitted,
    invoice: req.body.invoice,
    paid: req.body.paid,
    attachContract: req.body.attachContract,
    contractSpecs: req.body.contractSpecs,
    paymentSteps: req.body.paymentSteps,
    pdfLink: req.body.pdfLink,
    estimateNum: req.body.estimateNum,
    paidDate: req.body.paidDate
  };

  let query = {
    name: titleize(req.body.name),
    address: titleize(req.body.address),
    cityState: titleize(req.body.cityState),
    zip: req.body.zip,
    email: req.body.email,
    date: req.body.dateSubmitted,
    phone: req.body.phone,
    estimates: [estimate]
  };

  invoices.addInvoiceCustomer(query);

  res.end();
});

router.post("/updateCustomer", function(req, res, next) {
  var id = req.body.customer._id;

  invoices.updateCustomer(id, req.body.customer);
  res.end();
});

router.post("/updateestimate", function(req, res, next) {
  let query = req.body.obj;

  let total = 0;
  query.items.forEach(item => {
    total += Number(item.amount.replace("$", "")) * Number(item.quantity);
  });
  query.total = total;

  invoices.updateEstimate(query).then(res.sendStatus(200));
});

router.delete("/deleteestimate", function(req, res, next) {
  let query = req.body.obj;
  let id = req.body.id;

  invoices.deleteEstimate(id, query);
  res.end();
});

router.post("/savepdf", function(req, res, next) {
  let pdf = req.body.pdf;
});

router.get("/imgurl", function(req, res, next) {
  invoices.getLogoURI().then(item => {
    res.send(item);
  });
});

router.post("/generatePDF", function(req, res, next) {
  pdfgenerator.renderPdf(req.body, pdf => {
    res.json(pdf);
  });
});

router.get("/estimateNum", function(req, res, next) {
  invoices.getCurrentEstimateNum().then(resp => {
    res.json(resp);
  });
});

router.post("/estimateNum", function(req, res, next) {
  invoices.incrementEstimateNum();
  res.end();
});

router.get("/months", function(req, res, next) {
  // get all invoices
  // sort them by date,
  // res.json the first and last invoices
  var datesArr = [];
  var formattedDatesArr = [];
  invoices.getAllInvoices().then(clients => {
    clients.map(client => {
      client.estimates.map(estimates => {
        datesArr.push(estimates.paidDate);
      });
    });
    datesArr.map(date => {
      var newDate = moment(date).format("MMMM YYYY");
      if (!formattedDatesArr.includes(newDate)) {
        formattedDatesArr.push(newDate);
      }
    });
    formattedDatesArr.sort((a, b) => {
      return new Date(a) - new Date(b);
    });
    res.json(formattedDatesArr);
  });
  // res.end();
});

router.post("/estimatesinmonth", function(req, res, next) {
  var estimates = [];
  invoices.getAllInvoices().then(invoices => {
    invoices.map(invoice => {
      invoice.estimates.map(estimate => {
        if (req.body.month) {
          if (
            new Date(estimate.paidDate).getMonth() + 1 ===
              new Date(req.body.month).getMonth() + 1 &&
            new Date(estimate.paidDate).getFullYear() ===
              new Date(req.body.month).getFullYear()
          ) {
            estimates.push(estimate);
          }
        } else if (!req.body.month) {
          estimates.push(estimate);
        }
      });
    });
    res.json(estimates);
    // console.log(new Date(invoice.date).getMonth + 1 === new Date(req.body.month).getMonth + 1)
  });
});

module.exports = router;
