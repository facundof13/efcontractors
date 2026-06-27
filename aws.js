const aws = require('aws-sdk');
require('dotenv').config();

const s3 = new aws.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	// The bucket lives in us-east-2, which only accepts Signature V4.
	// Without these, getSignedUrl produces a SigV2 URL against the global
	// endpoint and S3 rejects the PUT with a 400.
	region: 'us-east-2',
	signatureVersion: 'v4'
});

module.exports = s3;
