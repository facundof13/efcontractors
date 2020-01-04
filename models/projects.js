var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
const projects = db.collection('projects');
var ObjectId = require('mongodb').ObjectID;
var s3 = require('../aws');

function getAllProjects() {
	return new Promise((resolve, reject) => {
		projects.find({}).toArray((err, items) => {
			resolve(items);
		});
	});
}

function getProjectById(id) {
	return new Promise((resolve, reject) => {
		projects
			.find({
				_id: ObjectId(id)
			})
			.toArray((err, item) => {
				resolve(item);
			});
	});
}

function returnProject(query) {
	return new Promise((resolve, reject) => {
		projects.find(query).toArray((err, items) => {
			resolve(items);
		});
	});
}

function addProject(query) {
	projects.insertOne(query, function(err, result) {
		console.log(`Added doc id ${result.ops[0]._id} to db`);
	});
}

function findObjectsInFolder(name) {
	return new Promise((resolve, reject) => {
		const s3params = {
			Bucket: 'efcontractors',
			Prefix: `${name}/`
		};
		s3.listObjectsV2(s3params, (err, data) => {
			resolve(false);
		});
	});
}

function findMatchingFolder(name) {
	return new Promise((resolve, reject) => {
		const s3params = {
			Bucket: 'efcontractors',
			MaxKeys: 20,
			Delimiter: '/'
		};
		s3.listObjectsV2(s3params, (err, data) => {
			data.CommonPrefixes.forEach((item) => {
				if (item.Prefix == name) resolve(true);
			});
			resolve(false);
		});
	});
}

function updateImagesSrc(id, imageUrl, thumbUrl) {
	let obj = {
		url: imageUrl
	};

	thumbUrl ? (obj.thumbUrl = thumbUrl) : '';

	projects.updateOne(
		{
			_id: ObjectId(id)
		},
		{
			$addToSet: {
				images: obj
			}
		},
		(err, item) => {
			console.log(err || 'Updated project image');
		}
	);
}

function removeImageFromFolder(id, imagesrc) {
	projects.updateOne(
		{
			_id: ObjectId(id)
		},
		{ $pull: { images: { url: imagesrc } } },
		(err, item) => {
			console.log(err || 'Removed project Image');
		}
	);
}

function deleteImageFromS3(path) {
	const s3params = {
		Bucket: 'efcontractors',
		Key: path
	};
	console.log(path);
	s3.deleteObject(s3params, function(err, data) {});
}

async function deleteEntireProject(id) {
	projects.deleteOne({ _id: ObjectId(id) }, (err, results) => {});
	await emptyS3Directory('efcontractors', id);
}

async function emptyS3Directory(bucket, dir) {
	const listParams = {
		Bucket: bucket,
		Prefix: dir
	};

	const listedObjects = await s3.listObjectsV2(listParams).promise();

	if (listedObjects.Contents.length === 0) return;

	const deleteParams = {
		Bucket: bucket,
		Delete: { Objects: [] }
	};

	listedObjects.Contents.forEach(({ Key }) => {
		deleteParams.Delete.Objects.push({ Key });
	});

	await s3.deleteObjects(deleteParams).promise();

	if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

module.exports = {
	getAllProjects,
	addProject,
	findMatchingFolder,
	findObjectsInFolder,
	updateImagesSrc,
	removeImageFromFolder,
	deleteImageFromS3,
	deleteEntireProject,
	returnProject,
	getProjectById
};
