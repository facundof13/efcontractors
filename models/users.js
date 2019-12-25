var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
const users = db.collection('users');
var bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectID;

function createUser(query, callback) {
	bcrypt.genSalt(function(err, salt) {
		bcrypt.hash(query.password, salt, function(err, hash) {
			query.password = hash;
			users.insertOne(query, function(err, res) {});
		});
	});
}

function getUserByUsername(user, callback) {
	var query = {
		username: user
	};
	users.findOne(query, callback);
}

function getUserById(id, callback) {
	users.findOne(
		{
			_id: ObjectId(id)
		},
		callback
	);
}

function comparePassword(password, hash, callback) {
	bcrypt.compare(password, hash, function(err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
}

module.exports = {
	createUser,
	getUserByUsername,
	getUserById,
	comparePassword
};
