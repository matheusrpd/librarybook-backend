const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const storageTypes = {

  local: new multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "uploads"),

    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        file.key = `${hash.toString("hex")}-${file.originalname}`;
        cb(null, file.key);
      });
    }
  }),

  s3: multerS3({
    s3: new aws.S3(),
    bucket: "librarybook",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        const fileName = `${hash.toString("hex")}-${file.originalname}`;
        cb(null, fileName);
      });
    }
  })
}

module.exports = {
  storage: storageTypes[process.env.STORAGE_TYPE]
};