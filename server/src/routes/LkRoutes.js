const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongodb').ObjectID

const websocket = require('../websocket')

const bot = require('../../../bot/bot')

const auth = require('../middlewares/AuthMiddleware')

const PlaceModel = require('../models/Places')
const MenuItemModel = require('../models/MenuItem')
const ActionItemModel = require('../models/Action')
const CategoryModel = require('../models/Category')
const DopModel = require('../models/Dop')

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
        const menuItem = await new MenuItemModel(req.body.data)
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

router.post("/api/update-menu-item", auth(), async (req, res) => {
    try {
        const menuItem = await new MenuItemModel(req.body.data)
        const add = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id), "goods._id": req.body.data._id },
            { $set: { "goods.$": menuItem } }
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

router.post('/api/accept-order', auth(), async (req, res) => {
    try {
        if (!req.body.telegram) {
            const user = await req.db.collection("users").aggregate([
                { $match: { _id: ObjectId(req.user._id) } },
                { $unwind: '$messages'},
                { $match: {'messages.orderId': req.body.order.orderId } },
                { $group: {_id: '$_id', list: {$push: '$messages'}, sockets: {$push: '$sockets'}}}
            ]).toArray()
            
            if (user[0]) {
                for (let i = 0; i < user[0].list[0].messages.length; i++) {
                    bot.editMessageText(
                        user[0].list[0].messages[i].chat.id,
                        user[0].list[0].messages[i].message_id,
                        user[0].list[0].messages[i].message_id,
                        `${user[0].list[0].messages[i].text.replace('⏳', '✅')}`,
                    );
                }
            }
        }

        const accept = await req.db.collection('users').updateOne(
            { 'orders.orderId': req.body.order.orderId },
            { $set: { 'orders.$.status': 'accepted' } } )

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
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/add-action', auth(), async (req, res) => {
    try {
        const action = await new ActionItemModel(req.body)
        const upload = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $push: { 'actions': action } }
        )
        if (upload) {
            res.status(200).json(action)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/update-action', auth(), async (req, res) => {
    try {
        const action = await new ActionItemModel(req.body)
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id), "actions._id": action._id },
            { $set: { "actions.$" : action } }
        )
        if (update) {
            res.status(200).json(action)
        }
    } catch (error) {
        console.error(error)
    }
})

router.delete('/api/delete-action/:id', auth(), async (req, res) => {
    try {
        const remove = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $pull: { actions: { _id: req.params.id } } }
        )
        if (remove) {
            res.status(200).send(true)
        } else {
            res.status(300).send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/update-categories-drag', auth(), async (req, res) => {
    try {
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { "categories" : req.body.categories } }
        )
        if (update) {
            res.status(200).send(true)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/remove-category', auth(), async (req, res) => {
    try {
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $pull: { "categories" : req.body.cat } }
        )
        if (update) {
            res.status(200).send(true)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/remove-dop', auth(), async (req, res) => {
    try {
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $pull: { "dops" : req.body.dop } }
        )
        if (update) {
            res.status(200).send(true)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/edit-category', auth(), async (req, res) => {
    try {
        const edit = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id), "categories._id": req.body.cat._id },
            { $set: { "categories.$" : req.body.cat } }
        )
        if (edit) {
            res.status(200).send(true)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/edit-dop', auth(), async (req, res) => {
    try {
        const edit = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id), "dops._id": req.body.dop._id },
            { $set: { "dops.$" : req.body.dop } }
        )
        if (edit) {
            res.status(200).send(true)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/create-category', auth(), async (req, res) => {
    try {
        const category = await new CategoryModel(req.body.cat)
        const edit = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $push: {
                'categories': { 
                    $each: [category],
                    $position: 0
                }
            } }
        )
        if (edit) {
            res.status(200).send(category)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/create-dop', auth(), async (req, res) => {
    try {
        const dop = await new DopModel(req.body.dop)
        const edit = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $push: {
                'dops': { 
                    $each: [dop],
                    $position: 0
                }
            } }
        )
        if (edit) {
            res.status(200).send(dop)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/update-order', auth(), async (req, res) => {
    try {
        for (let i in req.body.data) {
            const update = await req.db.collection('users').updateOne(
                { _id: ObjectId(req.user._id), "goods._id": req.body.data[i] },
                { $set: { "goods.$.order" : i } }
            )
        }
       
        res.status(200).send(true)
    } catch (error) {
        console.error(error)
    }
})

module.exports = router
