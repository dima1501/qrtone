const express = require("express");
const router = express.Router();

const path = require("path");
const multer = require("multer");
const fs = require("fs")
const sharp = require("sharp")

const auth = require('../middlewares/AuthMiddleware')

const { nanoid } = require('nanoid')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/static/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, (req.user ? req.user._id : nanoid()) + Date.now() + path.extname(file.originalname));
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

    if (req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png") {
      sharp(req.file.path, { failOnError: false }).resize(200, null, { withoutEnlargement: true }).jpeg({
        quality: 100,
        chromaSubsampling: '4:4:4'
      }).toFile(`../client/static/uploads/opt_${req.file.filename}`, (err, info) => {
        if (err) {
          console.error(err)
        } else {
          fs.unlink(req.file.path, function(err) {
            if (err) {
              throw err
            }
          })
          return res.status(201).json({
            message: "File uploded successfully",
            path: 'opt_' + req.file.filename,
          })
        }
      })
    } else {
      return res.status(201).json({
        message: "File uploded successfully",
        path: req.file.filename,
      })
    }
    
  } catch (error) {
    console.error(error);
  }
})

router.post("/api/upload-menu-item-image", auth(), upload.single("image"), (req, res) => {
  try {
    // return res.status(201).json({
    //   message: "File uploded successfully",
    //   path: req.file.filename,
    // });


    if (req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png") {
      sharp(req.file.path, { failOnError: false }).resize(800, null, { withoutEnlargement: true }).jpeg({
        quality: 100,
        chromaSubsampling: '4:4:4'
      }).toFile(`../client/static/uploads/opt_${req.file.filename}`, (err, info) => {
        if (err) {
          console.error(err)
        } else {

          fs.unlink(req.file.path, function(err) { if (err)  throw err })

          return res.status(201).json({
            message: "File uploded successfully",
            path: 'opt_' + req.file.filename,
          })
        }
      })
    } else {
      return res.status(201).json({
        message: "File uploded successfully",
        path: req.file.filename,
      })
    }

  } catch (error) {
    console.error(error);
  }
})

router.post("/api/upload-company-background", auth(), upload.single("image"), (req, res) => {
  try {
    if (req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png") {
      sharp(req.file.path, { failOnError: false }).resize(1080, null, { withoutEnlargement: true }).toFile(`../client/static/uploads/opt_${req.file.filename}`, (err, info) => {
        if (err) {
          console.error(err)
        } else {
          fs.unlink(req.file.path, function(err) {
            if (err) {
              throw err
            }
          })
          return res.status(201).json({
            message: "File uploded successfully",
            path: 'opt_' + req.file.filename,
          })
        }
      })
    } else {
      return res.status(201).json({
        message: "File uploded successfully",
        path: req.file.filename,
      })
    }
  } catch (error) {
    console.error(error)
  }
})

router.post("/api/delete-pic", auth(), (req, res) => {
  const pathToFile = `../client/static/uploads/${req.body.data}`

  fs.unlink(pathToFile, function(err) {
    if (err) {
      console.error(err)
    } else {
      // deleted
    }
  })

  res.status(200).send(true)
  
})

module.exports = router;
