const aws = require("aws-sdk");
require("dotenv").config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  Bucket: process.env.S3_BUCKET
});

module.exports = s3;
