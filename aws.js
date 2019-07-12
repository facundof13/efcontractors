const aws = require("aws-sdk");
const s3 = new aws.S3({
  accessKeyId: "AKIAIFZSGFGJVKEGUXFA",
  secretAccessKey: "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",
  Bucket: "efcontractors"
});

module.exports = s3
