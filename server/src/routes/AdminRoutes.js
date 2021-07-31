const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongodb').ObjectID

const auth = require('../middlewares/AuthMiddleware')

router.get('/api/admin/get-users', auth(), async (req, res) => {
    try {
        const users = await req.db.collection("users").find( {} ).toArray()
        if (users) {
            res.send(users)
        } else {
            res.send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

router.get('/api/admin/get-user-data/:id', auth(), async (req, res) => {
    try {
        const user = await req.db.collection("users").findOne( { _id: ObjectId(req.params.id) } )
        if (user) {
            res.send(user)
        } else {
            res.send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

module.exports = router
