var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
const invoices = db.collection('invoices');
var ObjectId = require('mongodb').ObjectID;
require('dotenv').config();

function getAllInvoices() {
	return new Promise((resolve, reject) => {
		invoices.find({ Name: { $exists: false } }).toArray((err, items) => {
			resolve(items);
		});
	});
}

function getServices() {
	return new Promise((resolve, reject) => {
		invoices
			.find({ _id: ObjectId('5d2e983f1c9d4400005a4e5a') })
			.toArray((err, items) => {
				resolve(items[0].services);
			});
	});
}

function addInvoiceService(service) {
	invoices.updateOne(
		{ _id: ObjectId('5d2e983f1c9d4400005a4e5a') },
		{ $push: { services: service } }
	);
}

function sendEmail(query) {
	try {
		const nodemailer = require('nodemailer');

		var transporter = nodemailer.createTransport({
			host: 'smtp.office365.com', // Office 365 server
			port: 587,     // secure SMTP
			secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EMAIL_PASSWORD
			},
			tls: {
				ciphers: 'SSLv3'
			}
		});
	} catch (err) {
		console.error(err);
	}
	let emails = [query.client.email, ...query.emails];
	emails.forEach((currentEmail) => {
		let estimateOrInvoiceOrReceipt = query.estimate.paid
			? 'a receipt'
			: query.estimate.invoice
				? 'an invoice'
				: 'an estimate';
		transporter.sendMail(
			{
				text: `Estimate Number: ${query.estimate.estimateNum
					}\nTotal: $${query.estimate.total.toLocaleString('en-US', {
						type: 'currency',
						currency: 'USD'
					})}\n\nEFContractors LLC has prepared ${estimateOrInvoiceOrReceipt}. Your document has been attached below. \n\n\nIf you have any issues or questions please contact us directly.\n\nThank you for your business!\n\n\EFContractors LLC`,
				from: process.env.EMAIL,
				to: currentEmail,
				subject: 'EF Contractors LLC',
				attachments: [
					{
						filename: 'Estimate.pdf',
						content: query.pdf.replace('data:application/pdf;base64,', ''),
						encoding: 'base64',
					}
				]
			},
			(err, msg) => {
				if (err) {
					console.log(err);
				} else {
					console.log(`Email sent to ${currentEmail}`);
				}
			}
		);
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
	invoices.deleteOne({ _id: ObjectId(id) }, (err, results) => { });
}

function updateCustomer(id, query) {
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
	return new Promise((resolve, reject) => {
		invoices.updateOne(
			{
				'estimates.date': query.date
			},
			{
				$set: {
					'estimates.$': query
				}
			}
		);
		resolve();
	});
}

function deleteEstimate(id, query) {
	invoices.updateOne(
		{ _id: ObjectId(id) },
		{ $pull: { estimates: { date: query.date } } }
	);
}

function getLogoURI() {
	return new Promise((resolve, reject) => {
		invoices
			.find({ _id: ObjectId('5d4084761c9d440000bbf98f') })
			.toArray((err, items) => {
				resolve(items);
			});
	});
}

function getCurrentEstimateNum() {
	return new Promise((resolve, reject) => {
		invoices
			.find({ _id: ObjectId('5d41ec9b1c9d44000046c695') })
			.toArray((err, items) => {
				resolve(items[0].estimateNum);
			});
	});
}

function incrementEstimateNum() {
	getCurrentEstimateNum().then((res) => {
		invoices.updateOne(
			{ _id: ObjectId('5d41ec9b1c9d44000046c695') },
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
	sendEmail,
	getAllInvoices,
	addInvoiceService
};
