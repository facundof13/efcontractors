var express = require('express');
var router = express.Router();
var services = require('../models/services.js');
var testimonials = require('../models/testimonials.js');
var projects = require('../models/projects');
var invoices = require('../models/invoices');
var settings = require('../models/settings');
const moment = require('moment');
const pdfgenerator = require('../models/pdfgenerator');

router.post('/api/sendemail', function (req, res, next) {
	invoices.sendEmail(req.body);
	res.sendStatus(200);
});

router.get('/api/testimonials', function (req, res, next) {
	testimonials.getAllTestimonials().then((testimonials) => {
		res.json(testimonials);
	});
});

// delete testimonial
router.delete('/api/testimonials', function (req, res, next) {
	testimonials.removeTestimonial(req.body.id);
	res.end();
});

// update testimonials
router.post('/api/updatetestimonials', function (req, res, next) {
	req.body.testimonials.map((testimonial) => {
		let query = {
			text: testimonial.text,
			name: testimonial.name,
			cityState: testimonial.cityState,
			verified: testimonial.verified,
			insertedDate: testimonial.insertedDate,
		};
		testimonials.updateTestimonial(testimonial._id, query);
	});
	res.end();
});

router.get('/api/settings', function (req, res, next) {
	settings.getSettings().then((settings) => {
		res.json(settings[0]);
	});
});

router.get('/api/invoicesettings', function (req, res, next) {
	settings.getInvoiceSettings().then((settings) => {
		res.json(settings[0]);
	});
});

router.post('/api/settings', function (req, res, next) {
	settings.updateSettings(req.body.settings);
	res.end();
});

router.post('/api/invoicesettings', function (req, res, next) {
	settings.updateInvoiceSettings(req.body.settings);
	res.end();
});

//add service
router.post('/api/addservices', function (req, res, next) {
	query = {
		Service: req.body.Service,
		Residential: req.body.Residential,
		Commercial: req.body.Commercial,
	};
	services.addService(query);
	res.end();
});

router.post('/api/addinvoiceservice', (req, res, next) => {
	invoices.addInvoiceService(req.body.service);
	res.end();
});

//delete service
router.delete('/api/services', function (req, res, next) {
	services.removeService(req.body._id);
	res.end();
});

//update service
router.post('/api/services', function (req, res, next) {
	let query = {
		Service: req.body.Service,
		Residential: req.body.Residential,
		Commercial: req.body.Commercial,
	};
	services.updateService(req.body._id, query);
	res.end();
});

/// admin/projects
router.get('/api/projects', function (req, res, next) {
	projects.getAllProjects().then((items) => {
		res.json(items);
	});
});

router.get('/api/projectname', async function (req, res, next) {
	const result = await projects.getProjectById(req.query.id);
	res.json(result);
});

// admin/newproject
router.post('/api/newproject', async function (req, res, next) {
	query = {
		name: req.body.name,
		location: req.body.location,
		images: [],
	};

	if (
		//check if strings are empty or undefined
		query.name === '' ||
		query.name === undefined ||
		query.location === '' ||
		query.location === undefined
	) {
		res.json({ error: `Project cannot have an empty name/location` });
	} else {
		projects.addProject(query);
		res.end();
	}
});

router.delete('/api/deleteimg', function (req, res, next) {
	const id = req.body.id;
	const imagesrc = req.body.image;
	// Add the url to be deleted, as well as the thumbnail url
	if (imagesrc.slice(-4) === '.mp4' || imagesrc.slice(-4) === '.mov') {
		const thumbsrc = imagesrc.replace(/(\.mp4)|(\.mov)/gm, 'thumb.jpg');
		const path2 = thumbsrc.replace(/.+amazonaws.com\//g, '');
		projects.deleteImageFromS3(path2);
	}

	projects.removeImageFromFolder(id, imagesrc);
	path = imagesrc.replace(/.+amazonaws.com\//g, '');
	projects.deleteImageFromS3(path);
	res.end();
});

router.delete('/api/deleteproject', function (req, res, next) {
	const id = req.body.id;
	const numImages = req.body.numImages;
	projects.deleteEntireProject(id, numImages);
	res.end();
});

router.get('/api/invoiceServices', async function (req, res, next) {
	invoices.getServices().then((item) => {
		res.json(item);
	});
});

router.get('/api/invoiceCustomers', async function (req, res, next) {
	invoices.getInvoiceCustomers().then((items) => {
		res.json(items);
	});
});

router.delete('/api/invoiceCustomerId', function (req, res, next) {
	invoices.deleteCustomer(req.body.id);
	res.end();
});

router.post('/api/invoiceupdate', function (req, res, next) {
	let total = 0;
	req.body.items.forEach((item) => {
		total += Number(item.amount.replace('$', '')) * Number(item.quantity);
	});

	let query = {
		expiration: req.body.expiration,
		title: _.startCase(req.body.title),
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
		paidDate: req.body.paidDate,
	};

	invoices.addEstimateToCustomer(req.body.id, query);
	res.end();
});

router.post('/api/invoice', function (req, res, next) {
	let items = req.body.items;

	let total = 0;
	items.forEach((item) => {
		total += Number(item.amount.replace('$', '')) * Number(item.quantity);
	});

	let estimate = {
		items: req.body.items,
		total: total,
		expiration: req.body.expiration,
		title: _.startCase(req.body.title),
		date: req.body.dateSubmitted,
		invoice: req.body.invoice,
		paid: req.body.paid,
		attachContract: req.body.attachContract,
		contractSpecs: req.body.contractSpecs,
		paymentSteps: req.body.paymentSteps,
		pdfLink: req.body.pdfLink,
		estimateNum: req.body.estimateNum,
		paidDate: req.body.paidDate,
	};

	let query = {
		name: _.startCase(req.body.name),
		address: _.startCase(req.body.address),
		cityState: _.startCase(req.body.cityState),
		zip: req.body.zip,
		email: req.body.email,
		date: req.body.dateSubmitted,
		phone: req.body.phone,
		estimates: [estimate],
	};

	invoices.addInvoiceCustomer(query);

	res.end();
});

router.post('/api/updateCustomer', function (req, res, next) {
	var id = req.body.customer._id;

	invoices.updateCustomer(id, req.body.customer);
	res.end();
});

router.post('/api/updateestimate', function (req, res, next) {
	let query = req.body.obj;

	let total = 0;
	query.items.forEach((item) => {
		total += Number(item.amount.replace('$', '')) * Number(item.quantity);
	});
	query.total = total;

	invoices.updateEstimate(query).then(res.sendStatus(200));
});

router.delete('/api/deleteestimate', function (req, res, next) {
	let query = req.body.obj;
	let id = req.body.id;

	invoices.deleteEstimate(id, query);
	res.end();
});

router.get('/api/imgurl', function (req, res, next) {
	invoices.getLogoURI().then((item) => {
		res.send(item);
	});
});

router.post('/api/generatePDF', function (req, res, next) {
	pdfgenerator.renderPdf(req.body, (pdf) => {
		res.json(pdf);
	});
});

router.get('/api/estimateNum', function (req, res, next) {
	invoices.getCurrentEstimateNum().then((resp) => {
		res.json(resp);
	});
});

router.post('/api/estimateNum', function (req, res, next) {
	invoices.incrementEstimateNum();
	res.end();
});

router.get('/api/months', function (req, res, next) {
	// get all invoices
	// sort them by date,
	// res.json the first and last invoices
	var datesArr = [];
	var formattedDatesArr = [];
	invoices.getAllInvoices().then((clients) => {
		clients.map((client) => {
			client.estimates.map((estimates) => {
				datesArr.push(estimates.paidDate);
			});
		});
		datesArr.map((date) => {
			var newDate = moment(date).format('MMMM YYYY');
			if (!formattedDatesArr.includes(newDate) && moment(date).isValid()) {
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

router.post('/api/estimatesinmonth', function (req, res, next) {
	var estimates = [];
	invoices.getAllInvoices().then((invoices) => {
		invoices.map((invoice) => {
			invoice.estimates.map((estimate) => {
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
	});
});

module.exports = router;
