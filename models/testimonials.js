var mongoUtil = require("../mongoUtil");
var db = mongoUtil.getDb();
const testimonials = db.collection("testimonials");
var ObjectId = require("mongodb").ObjectID;

// C
function addTestimonial(query) {
  testimonials.insertOne(query, function(err, result) {
    console.log(`Added ${result.ops[0]._id} to db.`);
  });
}

// R
function getAllVerifiedTestimonials() {
  return new Promise((resolve, reject) => {
    testimonials
      .find({
        Verified: true
      })
      .toArray((err, items) => {
        resolve(items);
      });
  });
}

// U
function updateTestimonial(id, query) {
  testimonials.updateOne(
    {
      _id: ObjectId(id)
    },
    {
      $set: query
    },
    (err, item) => {
      console.log(`Updated testimonial.`);
    }
  );
}

// D
function removeTestimonial(id) {
  testimonials.deleteOne(
    {
      _id: ObjectId(id)
    },
    (err, item) => {
      console.log(`Removed testimonial from db.`);
    }
  );
}

module.exports = {
  getAllVerifiedTestimonials,
  removeTestimonial,
  addTestimonial,
  updateTestimonial
};
