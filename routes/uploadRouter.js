const express = require('express');
const path = require('path');
var projects = require('../models/projects');
const s3 = require('../aws');

/**
 * Direct-to-S3 uploads via presigned URLs.
 *
 * Large files used to be streamed browser -> dyno -> S3, which blows past
 * Heroku's 30s request timeout (seen as a 499 on the client). Now the browser
 * uploads straight to S3 and the server only (a) signs short-lived PUT URLs and
 * (b) records the resulting public URLs on the project. Neither call carries the
 * file payload, so the dyno is never the bottleneck.
 */
const router = express.Router();

const BUCKET = 'efcontractors';
const BASE_URL = 'https://efcontractors.s3.us-east-2.amazonaws.com/';
const URL_EXPIRY_SECONDS = 300; // presigned PUT URLs are valid for 5 minutes

// Same allow-list the old multer fileFilter used.
const allowedTypes = /jpeg|jpg|png|gif|m4v|mp4|mov|quicktime/;

function sanitizeName(filename) {
	return path
		.basename(filename)
		.toLowerCase()
		.replace(/\s/g, '');
}

function isAllowed(filename, contentType) {
	const extOk = allowedTypes.test(path.extname(filename).toLowerCase());
	const mimeOk = allowedTypes.test((contentType || '').toLowerCase());
	return extOk && mimeOk;
}

/**
 * Step 1: hand the browser a presigned PUT URL per file so it can upload
 * directly to S3. Body: { projectName, files: [{ filename, contentType }] }
 */
router.post('/presign', async (req, res) => {
	try {
		const projectName = req.body.projectName || req.query.projectName;
		const files = req.body.files;

		if (!projectName || !Array.isArray(files) || files.length === 0) {
			return res
				.status(400)
				.json({ error: 'projectName and a non-empty files[] are required' });
		}
		// up to 30 media files + up to 30 generated video thumbnails
		if (files.length > 60) {
			return res.status(400).json({ error: 'Too many files in one batch' });
		}

		const signed = await Promise.all(
			files.map(async (f) => {
				const filename = sanitizeName(f.filename);
				if (!isAllowed(filename, f.contentType)) {
					throw new Error(`Invalid file type: ${f.filename}`);
				}
				const key = `${projectName}/${filename}`;
				const uploadUrl = await s3.getSignedUrlPromise('putObject', {
					Bucket: BUCKET,
					Key: key,
					ContentType: f.contentType,
					ACL: 'public-read',
					Expires: URL_EXPIRY_SECONDS,
				});
				return {
					filename,
					key,
					uploadUrl,
					publicUrl: `${BASE_URL}${key}`,
					contentType: f.contentType,
				};
			})
		);

		res.json({ files: signed });
	} catch (err) {
		console.log(err);
		res.status(400).json({ error: err.message });
	}
});

/**
 * Step 2: once the browser has finished uploading straight to S3, it reports
 * the final public URLs and we record them on the project.
 * Body: { projectName, images: [{ url, thumbUrl? }] }
 */
router.post('/confirm', (req, res) => {
	const projectName = req.body.projectName || req.query.projectName;
	const images = req.body.images;

	if (!projectName || !Array.isArray(images)) {
		return res
			.status(400)
			.json({ error: 'projectName and images[] are required' });
	}

	images.forEach((img) => {
		if (img && img.url) {
			projects.updateImagesSrc(projectName, img.url, img.thumbUrl);
		}
	});

	res.json({ ok: true, count: images.length });
});

module.exports = router;
