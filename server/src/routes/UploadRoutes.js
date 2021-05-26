const express = require("express");
const router = express.Router();

const path = require("path");
const multer = require("multer");
const fs = require("fs")

const auth = require('../middlewares/AuthMiddleware')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/static/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.user._id + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/svg+xml") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/api/upload-company-logo", auth(), upload.single("image"), (req, res) => {
  try {
    return res.status(201).json({
      message: "File uploded successfully",
      path: req.file.filename,
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/api/upload-menu-item-image", auth(), upload.single("image"), (req, res) => {
  try {
    return res.status(201).json({
      message: "File uploded successfully",
      path: req.file.filename,
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/api/delete-pic", auth(), (req, res) => {
  const pathToFile = `../client/static/uploads/${req.body.data}`

  fs.unlink(pathToFile, function(err) {
    if (err) {
      throw err
    } else {
      res.status(200).send(true)
    }
  })
  
})

module.exports = router;
