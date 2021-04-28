const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongodb').ObjectID

const websocket = require('../websocket')

router.get('/', async (req, res) => {
    res.status(200)
})

module.exports = router
