var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
const services = db.collection('services');
var ObjectId = require('mongodb').ObjectID;

function addService(query) {
	services.insertOne(query, function(err, result) {
		console.log(`Added ${result.ops[0]._id} to db.`);
	});
}

function getAllServices() {
	return new Promise((resolve, reject) => {
		services.find({}).toArray((err, items) => {
			resolve(items);
		});
	});
}

function updateService(id, query) {
	services.updateOne(
		{
			_id: ObjectId(id)
		},
		{
			$set: query
		},
		(err, item) => {
			console.log('Updated service');
		}
	);
}

function removeService(id) {
	console.log(id);
	services.deleteOne(
		{
			_id: ObjectId(id)
		},
		(err, item) => {
			console.log('Removed service from db');
		}
	);
}

module.exports = {
	getAllServices,
	addService,
	removeService,
	updateService
};
