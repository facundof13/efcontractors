const express = require("express");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");
var projects = require("../models/projects");
var name;

/**
 * express.Router() creates modular, mountable route handlers
 * A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.
 */
const router = express.Router();
/**
 * PROFILE IMAGE STORING STARTS
 */
const baseurl = "https://efcontractors.s3.us-east-2.amazonaws.com/";
const s3 = require("../aws");
var fileUrls = [];

/**
 * Check File Type
 * 
@param file
 * 
@param cb
 * 
@return {*}
 */
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|m4v|mp4|mov/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  console.log(`extname: ${path.extname(file.originalname).toLowerCase()}}`);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: .jpeg, .jpg, .png, .gif, .m4v, .mp4, .mov extensions only!");
  }
}
/*
 * MULTIPLE FILE UPLOADS
 */
// Multiple File Uploads ( max 4 )
const uploadsBusinessGallery = multer({
  storage: multerS3({
    s3: s3,
    bucket: "efcontractors",
    acl: "public-read",
    key: function(req, file, cb) {
      name = req.query.projectName;
      var partPath =
        path.basename(file.originalname, path.extname(file.originalname)) +
        "-" +
        Date.now() +
        path.extname(file.originalname);
      var fullpath = req.query.projectName + "/" + partPath;
      fileUrls.push(`${baseurl}${fullpath}`);
      cb(null, fullpath);
    }
  }),
  limits: { fileSize: 524288000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).array("galleryImage", 30);

router.post("/multiple-file-upload", (req, res) => {
  uploadsBusinessGallery(req, res, error => {
    if (error) {
      res.json({ error: error });
    } else {
      // If File not found
      if (req.files === undefined) {
        res.json("Error: No File Selected");
      } else {
        // If Success
        //add each file to project user's db
        for (let i = 0; i < fileUrls.length; i++) {
          projects.updateImagesSrc(name, fileUrls[i]);
        }
        fileUrls = [];
        let fileArray = req.files,
          fileLocation;
        const galleryImgLocationArray = [];
        for (let i = 0; i < fileArray.length; i++) {
          fileLocation = fileArray[i].location;
          galleryImgLocationArray.push(fileLocation);
        }
        // Save the file name into database
        res.json({
          filesArray: fileArray,
          locationArray: galleryImgLocationArray
        });
      }
    }
  });
});
// We export the router so that the server.js file can pick it up
module.exports = router;
