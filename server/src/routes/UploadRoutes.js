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
      sharp(req.file.path, { failOnError: false }).resize(200, null, { withoutEnlargement: true }).withMetadata().jpeg({
        quality: 100,
        chromaSubsampling: '4:4:4'
      }).toFile(`../client/static/uploads/opt_${req.file.filename}`, (err, info) => {
        if (err) {
          console.error(err)
        } else {
          fs.unlink(req.file.path, function(err) { if (err) throw err })
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
    if (req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png") {

      let qual = 100

      sharp(req.file.path, { failOnError: false })

      .jpeg({ quality: qual })
      .rotate().resize(255, 255, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/255-opt_${req.file.filename}`, (err, info) => {
        if (err) {  console.error(err) }
      })
      .webp({ quality: qual })
      .rotate().resize(255, 255, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/255-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) {  console.error(err) }
      })

      .jpeg({ quality: qual })
      .rotate().resize(520, 520, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/520-opt_${req.file.filename}`, (err, info) => {
        if (err) {  console.error(err) }
      })
      .webp({ quality: qual })
      .rotate().resize(520, 520, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/520-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) {  console.error(err) }
      })

      .jpeg({ quality: qual })
      .rotate().resize(196, 196, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/196-opt_${req.file.filename}`, (err, info) => {
        if (err) {  console.error(err) }
      })
      .webp({ quality: qual })
      .rotate().resize(196, 196, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/196-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) {  console.error(err) }
      })

      .jpeg({ quality: qual })
      .rotate().resize(392, 392, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/392-opt_${req.file.filename}`, (err, info) => {
        if (err) {  console.error(err) }
      })
      .webp({ quality: qual })
      .rotate().resize(392, 392, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/392-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) {  console.error(err) }
      })

      .jpeg({ quality: qual })
      .rotate().resize(171, 171, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/171-opt_${req.file.filename}`, (err, info) => {
        if (err) {  console.error(err) }
      })
      .webp({ quality: qual })
      .rotate().resize(171, 171, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/171-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) {  console.error(err) }
      })

      .jpeg({ quality: qual })
      .rotate().resize(342, 342, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/342-opt_${req.file.filename}`, (err, info) => {
        if (err) {  console.error(err) }
      })
      .webp({ quality: qual })
      .rotate().resize(342, 342, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/342-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) {  console.error(err) }
      })

      .jpeg({ quality: qual })
      .rotate().resize(400, 400, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/400-opt_${req.file.filename}`, (err, info) => {
        if (err) {  console.error(err) }
      })
      .webp({ quality: qual })
      .rotate().resize(400, 400, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/400-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) {  console.error(err) }
      })

      .jpeg({ quality: qual })
      .rotate().resize(800, 800, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/800-opt_${req.file.filename}`, (err, info) => {
        if (err) {  console.error(err) }
      })
      .webp({ quality: qual })
      .rotate().resize(800, 800, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/800-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) {  console.error(err) } else {
          fs.unlink(req.file.path, function(err) { if (err)  throw err })

          return res.status(201).json({
            message: "File uploded successfully",
            path: 'opt_' + req.file.filename,
            webp: true
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

      let qual = 90

      sharp(req.file.path, { failOnError: false })
      
      .jpeg({ quality: qual })
      .rotate().resize(1080, null, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/1080-opt_${req.file.filename}`, (err, info) => {
        if (err) {
          console.error(err)
        }
      })

      .jpeg({ quality: qual })
      .rotate().resize(560, null, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/560-opt_${req.file.filename}`, (err, info) => {
        if (err) {
          console.error(err)
        }
      })

      .jpeg({ quality: qual })
      .rotate().resize(2160, null, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/2160-opt_${req.file.filename}`, (err, info) => {
        if (err) {
          console.error(err)
        }
      })

      .webp({ quality: qual })
      .rotate().resize(560, null, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/560-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) {
          console.error(err)
        }
      })

      .webp({ quality: qual })
      .rotate().resize(1080, null, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/1080-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) {
          console.error(err)
        }
      })

      .webp({ quality: qual })
      .rotate().resize(2160, null, { withoutEnlargement: true })
      .toFile(`../client/static/uploads/2160-opt_${req.file.filename}.webp`, (err, info) => {
        if (err) { console.error(err)} else {
          fs.unlink(req.file.path, function(err) { if (err) throw err })
          return res.status(201).json({
            message: "File uploded successfully",
            path: 'opt_' + req.file.filename,
            webp: true
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

  const path = '../client/static/uploads/'
  const fileName = req.body.data

  fs.unlink(path + '2160-' + fileName, function(err) { if (err) console.error(err) })
  fs.unlink(path + '1080-' + fileName, function(err) { if (err) console.error(err) })
  fs.unlink(path + '560-' + fileName, function(err) { if (err) console.error(err) })

  fs.unlink(path + '255-' + fileName, function(err) { if (err) console.error(err) })
  fs.unlink(path + '520-' + fileName, function(err) { if (err) console.error(err) })
  fs.unlink(path + '196-' + fileName, function(err) { if (err) console.error(err) })
  fs.unlink(path + '392-' + fileName, function(err) { if (err) console.error(err) })
  fs.unlink(path + '171-' + fileName, function(err) { if (err) console.error(err) })
  fs.unlink(path + '342-' + fileName, function(err) { if (err) console.error(err) })
  fs.unlink(path + '400-' + fileName, function(err) { if (err) console.error(err) })
  fs.unlink(path + '800-' + fileName, function(err) { if (err) console.error(err) })

  fs.unlink(path + '2160-' + fileName + '.webp', function(err) { if (err) console.error(err) })
  fs.unlink(path + '1080-' + fileName + '.webp', function(err) { if (err) console.error(err) })
  fs.unlink(path + '560-' + fileName + '.webp', function(err) { if (err) console.error(err) })

  fs.unlink(path + '255-' + fileName + '.webp', function(err) { if (err) console.error(err) })
  fs.unlink(path + '520-' + fileName + '.webp', function(err) { if (err) console.error(err) })
  fs.unlink(path + '196-' + fileName + '.webp', function(err) { if (err) console.error(err) })
  fs.unlink(path + '392-' + fileName + '.webp', function(err) { if (err) console.error(err) })
  fs.unlink(path + '171-' + fileName + '.webp', function(err) { if (err) console.error(err) })
  fs.unlink(path + '342-' + fileName + '.webp', function(err) { if (err) console.error(err) })
  fs.unlink(path + '400-' + fileName + '.webp', function(err) { if (err) console.error(err) })
  fs.unlink(path + '800-' + fileName + '.webp', function(err) { if (err) console.error(err) })

  // fs.unlink(pathToFile, function(err) { if (err) console.error(err) })
  // fs.unlink(pathToFile + '.webp', function(err) { if (err) console.error(err) })
  // fs.unlink('2160-' + pathToFile + '.webp', function(err) { if (err) console.error(err) })
  // fs.unlink('1080-' +pathToFile + '.webp', function(err) { if (err) console.error(err) })
  // fs.unlink('560-' +pathToFile + '.webp', function(err) { if (err) console.error(err) })
  // fs.unlink('2160-' +pathToFile, function(err) { if (err) console.error(err) })
  // fs.unlink('1080-' +pathToFile, function(err) { if (err) console.error(err) })
  // fs.unlink('560-' +pathToFile, function(err) { if (err) console.error(err) })
  res.status(200).send(true)
})

module.exports = router;
