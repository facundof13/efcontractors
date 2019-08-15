var mongoUtil = require("../mongoUtil");
var db = mongoUtil.getDb();
const projects = db.collection("projects");
var ObjectId = require("mongodb").ObjectID;
var s3 = require("../aws");

// R
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
      Bucket: "efcontractors",
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
      Bucket: "efcontractors",
      MaxKeys: 20,
      Delimiter: "/"
    };
    s3.listObjectsV2(s3params, (err, data) => {
      data.CommonPrefixes.forEach(item => {
        if (item.Prefix == name) resolve(true);
      });
      resolve(false);
    });
  });
}

function updateImagesSrc(id, arr) {
  projects.updateOne(
    {
      _id: ObjectId(id)
    },
    {
      $addToSet: {
        images: arr
      }
    },
    (err, item) => {
      console.log("Updated project image");
    }
  );
}

function removeImageFromFolder(id, imagesrc) {
  projects.updateOne(
    {
      _id: ObjectId(id)
    },
    { $pull: { images: imagesrc } },
    (err, item) => {
      console.log("Removed project Image");
    }
  );
}

function deleteImageFromS3(path) {
  const s3params = {
    Bucket: "efcontractors",
    Key: path
  };
  console.log(path);
  s3.deleteObject(s3params, function(err, data) {});
}

function deleteEntireProject(id) {
  const s3params = {
    Bucket: "efcontractors",
    Key: id
  };
  projects.deleteOne({ _id: ObjectId(id) }, (err, results) => {});
  s3.deleteObject(s3params, (err, results) => {});
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

