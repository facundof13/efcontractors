require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_USER;

var _db;

module.exports = {
	connectToServer: async function () {
		const client = await MongoClient.connect(uri, { useNewUrlParser: true });
		_db = client.db('EFContractors');
		console.log('we have a connection');

		// .then(client => {
		// console.log(client);
		// });
		// function(err, client) {
		// 	if (err) console.log(err);
		// 	return callback(err);
		// }
	},

	getDb: function () {
		return _db;
	}
};
