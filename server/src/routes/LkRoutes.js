const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongodb').ObjectID

const websocket = require('../websocket')

const bot = require('../../../bot/bot')

const auth = require('../middlewares/AuthMiddleware')

const PlaceModel = require('../models/Places')
const MenuItemModel = require('../models/MenuItem')

router.post("/api/update-user-name", auth(), async (req, res) => {
    try {
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { name: req.body.name } }
        )
        if (update) {
            res.status(200).send(true)
        }
    } catch (err) {
        console.error(err);
    }
});

router.post("/api/update-company-logo", auth(), async (req, res) => {
    try {
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { photo: req.body.url } }
        )
        if (update) {
            res.status(200).send(true)
        }
    } catch (err) {
        console.error(err);
    }
});

router.post("/api/update-company-background", auth(), async (req, res) => {
    try {
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { background: req.body.url } }
        )
        if (update) {
            res.status(200).send(true)
        }
    } catch (err) {
        console.error(err);
    }
});

router.post("/api/add-new-place", auth(), async (req, res) => {
    try {
        const place = await new PlaceModel(req.body.data)
        const add = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $push: { places: place} }
        )
        if (add) {
            res.status(200).send(place)
        }
    } catch (err) {
        console.error(err);
    }
});

router.post("/api/edit-place", auth(), async (req, res) => {
    try {
        const edit = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id), "places._id": req.body.data._id },
            { $set: { "places.$" : req.body.data } }
        )
        if (edit) {
            res.status(200).send(true)
        }
    } catch (err) {
        console.error(err);
    }
});

router.get("/api/load-places", auth(), async (req, res) => {
    try {
        const user = await req.db.collection('users').findOne(
            { _id: ObjectId(req.user._id) }
        )
        if (user) {
            res.status(200).send(user.places)
        }
    } catch (err) {
        console.error(err);
    }
});

router.post("/api/add-menu-item", auth(), async (req, res) => {
    try {
        const menuItem = await new MenuItemModel(req.body.data.item)
        const add = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $push: { goods: menuItem } }
        )
        if (add) {
            res.send(menuItem)
        }
    } catch (err) {
        console.error(err);
    }
});

router.post('/api/update-good', auth(), async (req, res) => {
    try {
        const update = await req.db
          .collection('users')
          .updateOne(
            {
              _id: ObjectId(req.user._id),
              'goods._id': req.body._id
            },
            { $set: {
              'goods.$.places': req.body.places
            } }
          )
  
        if (update) {
          res.send(true)
        } else {
          res.send(false)
        }
  
        } catch (error) {
            console.error(error)
        }
    }
)

router.post('/api/update-categories', auth(), async (req, res) => {
    try {
        const update = await req.db
          .collection('users')
          .updateOne(
            {
              _id: ObjectId(req.user._id)
            },
            { $set: {
              'categories': req.body.categories
            } }
          )
  
        if (update) {
          res.send(true)
        } else {
          res.send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/accept-order', auth(), async (req, res) => {

    if (!req.body.telegram) {
        const user = await req.db.collection("users").aggregate([
            { $match: { _id: ObjectId(req.user._id) } },
            { $unwind: '$messages'},
            { $match: {'messages.orderId': req.body.order.orderId } },
            { $group: {_id: '$_id', list: {$push: '$messages'}, sockets: {$push: '$sockets'}}}
        ]).toArray()

        for (let i = 0; i < user[0].list[0].messages.length; i++) {
            bot.editMessageText(
                user[0].list[0].messages[i].chat.id,
                user[0].list[0].messages[i].message_id,
                user[0].list[0].messages[i].message_id,
                `${user[0].list[0].messages[i].text.replace('⏳', '✅')}`,
            );
        }
    }

    const accept = await req.db.collection('users').updateOne(
        { ['orders.'+ req.body.order.guestId +'.orderId']: req.body.order.orderId },
        { $set: { ['orders.'+ req.body.order.guestId +'.$.status']: 'accepted' } },
        false,
        true
    )

    const guest = await req.db.collection('guests').findOne({ _id: ObjectId(req.body.order.guestId) })

    if (guest.socket) {
        websocket.acceptOrder({
            socket: guest.socket,
            orderId: req.body.order.orderId
        })
    }

    websocket.acceptOrderAdmin({
        sockets: req.body.order.sockets,
        orderId: req.body.order.orderId,
        guestId: req.body.order.guestId
    })

    if (accept) {
        res.status(200).send(true)
    }
})

module.exports = router
