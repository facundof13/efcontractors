var express = require("express");
var router = express.Router();
var services = require("../models/services.js");
var testimonials = require("../models/testimonials.js");
var projects = require("../models/projects");
var invoices = require("../models/invoices");
const titleize = require("titleize");
const moment = require("moment");

/* GET admins listing. */

// router.all('/*', (req, res, next) => {
//   if (!req.session.passport || !req.session.passport.user)
//     return res.status(401).json({
//       status: "Please log in"
//     });
//   return next();
// })

// delete testimonial
router.delete("/testimonials/delete/:id", function(req, res, next) {
  const id = req.params.id;
  testimonials.removeTestimonial(id);
  res.end();
});

// update testimonials
router.put(
  "/testimonials/update/:idToUpdate/:text?/:name?/:citystate?/:verified?",
  function(req, res, next) {
    // pass in old id, new doc containing what to update
    // ex {Text: "Hello thank you" }

    const idToUpdate = req.params.idToUpdate;
    const Text = req.query.text;
    const Name = req.query.name;
    const CityState = req.query.citystate;
    const Verified = req.query.verified;

    const query = {};
    if (Text) query.Text = Text;
    if (Name) query.Name = Name;
    if (CityState) query.CityState = CityState;

    if (Verified) {
      if (Verified === "true") query.Verified = true;
      else query.Verified = false;
    }

    testimonials.updateTestimonial(idToUpdate, query);
    res.end();
  }
);

//add service
router.post("/services/add/:service/:residential/:commercial", function(
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
    Service: req.params.service,
    Residential: Number(req.params.residential),
    Commercial: Number(req.params.commercial)
  };
  services.addService(query);
  res.end();
});

//delete service
router.delete("/services/delete/:id", function(req, res, next) {
  const id = req.params.id;
  services.removeService(id);
  res.end();
});

//update service
router.put(
  "/services/update/:idToUpdate/:service?/:residential?/:commercial?",
  function(req, res, next) {
    const id = req.params.idToUpdate;

    const service = req.query.service;
    const residential = req.query.residential;
    const commercial = req.query.commercial;

    const query = {};
    if (service) query.Service = service;
    if (residential) query.Residential = Number(residential);
    if (commercial) query.Commercial = Number(commercial);

    services.updateService(id, query);
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
  let expiration = req.body.expiration;
  let title = titleize(req.body.title);
  let items = req.body.items;
  let date = req.body.date;
  let id = req.body.id;

  let total = 0;
  items.forEach(item => {
    total += Number(item.amount.replace("$", ""));
  });

  let query = {
    expiration: expiration,
    title: title,
    items: items,
    date: date,
    total: total
  }

  invoices.addEstimateToCustomer(id, query)
  res.end();
});

router.post("/invoice", function(req, res, next) {
  let name = titleize(req.body.name);
  let address = titleize(req.body.address);
  let cityState = titleize(req.body.cityState);
  let zip = req.body.zip;
  let expiration = req.body.expiration;
  let title = titleize(req.body.title);
  let email = req.body.email;
  let items = req.body.items;
  let phone = req.body.phone;
  let date = req.body.dateSubmitted;

  let total = 0;
  items.forEach(item => {
    total += Number(item.amount.replace("$", ""));
  });

  let invoice = {
    items: items,
    total: total,
    expiration: expiration,
    title: title,
    date: date
  };

  let query = {
    name: name,
    address: address,
    cityState: cityState,
    zip: zip,
    email: email,
    date: date,
    phone: phone,
    estimates: [invoice]
  };

  invoices.addInvoiceCustomer(query);

  res.end();
});

router.post("/updateCustomer", function(req, res, next) {
  let id = req.body.customer._id;
  let name = titleize(req.body.customer.name);
  let address = titleize(req.body.customer.address);
  let cityState = titleize(req.body.customer.cityState);
  let zip = req.body.customer.zip;
  let title = titleize(req.body.customer.title);
  let email = req.body.customer.email;
  let phone = req.body.customer.phone;
  let date = req.body.customer.date;

  let query = {
    name: name,
    address: address,
    cityState: cityState,
    zip: zip,
    title: title,
    email: email,
    phone: phone,
    date: date
  };

  invoices.updateCustomer(id, query);
  res.end();
});
module.exports = router;
