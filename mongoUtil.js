const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Facundo:Figueroa1@efcontractors-zdquu.mongodb.net/test?retryWrites=true&w=majority";

var _db;

module.exports = {

  connectToServer: function (callback) {
    MongoClient.connect(uri, {
      useNewUrlParser: true
    }, function (err, client) {
      if (err) console.log(err)
      _db = client.db('EFContractors');
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  }
};