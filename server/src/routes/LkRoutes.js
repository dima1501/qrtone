const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongodb').ObjectID

const websocket = require('../websocket')

const auth = require('../middlewares/AuthMiddleware')

const PlaceModel = require('../models/Places')
const MenuItemModel = require('../models/MenuItem')
const ActionItemModel = require('../models/Action')
const CategoryModel = require('../models/Category')
const DopModel = require('../models/Dop')
const WaiterModel = require('../models/Waiter')

// telegram area
const Markup = require('telegraf/markup')
const bot = require('../../../bot/bot')
// telegram area

const moment = require('moment')

router.post("/api/update-user-name", auth(), async (req, res) => {
    try {
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { name: req.body.data.name, description: req.body.data.description } }
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
            { $set: { background: req.body.url, bgWebp: req.body.webp } }
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
        const place = await new PlaceModel(req.body)
        const check = await req.db.collection('users').findOne(
            { 'places.link': place.link }
        )
        if (check) {
            place.link = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6)
        }
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
            { _id: ObjectId(req.user._id), "places._id": req.body._id },
            { $set: { "places.$" : req.body } }
        )
        if (edit) {
            res.status(200).send(true)
        }
    } catch (err) {
        console.error(err);
    }
});

router.post("/api/remove-place", auth(), async (req, res) => {
    try {
        const remove = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id), "places._id": req.body._id },
            { $pull: { places: { _id: req.body._id } } }
        )
        if (remove) {
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
            { _id: ObjectId(req.user ? req.user._id : req.body._id) },
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

router.post("/api/update-menu-item-admin", auth(), async (req, res) => {
    try {
        const menuItem = await new MenuItemModel(req.body.data)
        const add = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.body._id), "goods._id": req.body.data._id },
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

router.post('/api/update-good-admin', auth(), async (req, res) => {
    try {
        const update = await req.db
          .collection('users')
          .updateOne(
            {
              _id: ObjectId(req.body._id),
              'goods._id': req.body.good._id
            },
            { $set: {
              'goods.$.places': req.body.good.places
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
            sockets: req.user ? req.user.sockets : req.body.order.sockets[0],
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

router.delete('/api/delete-menu-item/:id', auth(), async (req, res) => {
    try {
        const remove = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            { $pull: { goods: { _id: req.params.id } } }
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

router.delete('/api/delete-menu-item-admin/:id/:user', auth(), async (req, res) => {
    try {
        const remove = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.params.user) },
            { $pull: { goods: { _id: req.params.id } } }
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

router.post('/api/update-categories-drag-admin', auth(), async (req, res) => {
    try {
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.body._id) },
            { $set: { "categories" : req.body.categories } }
        )
        if (update) {
            res.status(200).send(true)
        } else {
            res.status(200).send(false)
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

router.post('/api/remove-category-admin', auth(), async (req, res) => {
    try {
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.body.data._id) },
            { $pull: { "categories" : req.body.data.cat } }
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
            { _id: ObjectId(req.user ? req.user._id : req.body.data._id) },
            { $pull: { "dops" : req.body.data.dop } }
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

router.post('/api/edit-category-admin', auth(), async (req, res) => {
    try {
        const edit = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.body.data._id), "categories._id": req.body.data.cat._id },
            { $set: { "categories.$" : req.body.data.cat } }
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
            { _id: ObjectId(req.user ? req.user._id : req.body.data._id), "dops._id": req.body.data.dop._id },
            { $set: { "dops.$" : req.body.data.dop } }
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

router.post('/api/create-category-admin', auth(), async (req, res) => {
    try {
        const category = await new CategoryModel(req.body.data.cat)
        const edit = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.body.data._id) },
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
        console.log(req.body)
        const dop = await new DopModel(req.body.data.dop)
        const edit = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user ? req.user._id : req.body.data._id) },
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

router.post('/api/update-order-admin', auth(), async (req, res) => {
    try {
        for (let i in req.body.data.arr) {
            const update = await req.db.collection('users').updateOne(
                { _id: ObjectId(req.body.data._id), "goods._id": req.body.data.arr[i] },
                { $set: { "goods.$.order" : i } }
            )
        }
       
        res.status(200).send(true)
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/accept-fast-action', auth(), async (req, res) => {
    try {
        const accept = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id), "notifications._id": req.body.data._id },
            { $set: { "notifications.$.status" : 'accepted' } }
        )

        for (let i = 0; i < req.body.data.messages.length; i++) {
            bot.editMessageText(
                req.body.data.messages[i].chat.id,
                req.body.data.messages[i].message_id,
                req.body.data.messages[i].message_id,
                `${req.body.data.messages[i].text.replace('⏳', '✅').replace('🙋🏼‍♂️', '✅')}`
            );
        }

        if (req.user.sockets.length) {
            websocket.acceptFastAction({
                sockets: req.user.sockets,
                data: req.body.data
            })
        }

        if (accept) {
            res.status(200).send(true)
        } else {
            res.status(404).send(false)
        }
        
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/accept-fast-action-tg', auth(), async (req, res) => {
    const accept = await req.db.collection('users').updateOne(
        { "notifications._id": req.body._id },
        { $set: { "notifications.$.status" : 'accepted' } }
    )
    res.status(200).send(true)
})

router.post('/api/set-place-socket-id', auth(), async (req, res) => {
    try {
        await req.db.collection('users').updateOne(
            { 'sockets.socketId': req.body.data.socketId },
            {'$pull': { "sockets": { "socketId": req.body.data.socketId } } }
        )
        if (req.user) {
            if (req.body.data.place) {
                const set = await req.db.collection('users').updateOne(
                    { _id: ObjectId(req.user._id) },
                    { $push: { 'sockets': {place: req.body.data.place, socketId: req.body.data.socketId } } }
                )
            }

            await req.db.collection('users').updateOne(
                { _id: ObjectId(req.user._id) },
                { $push: { 'publicSockets': req.body.data.socketId } }
            )
        }
        res.status(200).send(true)
    } catch (error) {
        console.error(error)
    }
})

router.get('/api/load-orders-place/:id/:items', auth(), async (req, res) => {
    try {
        if (!req.user) {
            res.status(200).send(false)
            return
        }
        const orders = await req.db.collection("users").aggregate([
            { $match: { _id: ObjectId(req.user._id) } },
            { $unwind: '$orders'},
            { $match: {'orders.place': req.params.id } },
            { $sort: { 'orders.timestamp': -1 } },
            { $skip: +req.params.items },
            { $limit: 10 },
            { $group: { _id: '$_id', list: {$push: '$orders' } } }
        ]).toArray()

        if (orders) {
            res.status(200).send(orders)
        } else {
            res.status(200).send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

router.get('/api/load-actions-place/:id/:items', auth(), async (req, res) => {
    try {
        if (!req.user) {
            res.status(200).send(false)
            return
        }
        const notifications = await req.db.collection("users").aggregate([
            { $match: { _id: ObjectId(req.user._id) } },
            { $unwind: '$notifications'},
            { $match: {'notifications.place': req.params.id } },
            { $sort: { 'notifications.timestamp': -1 } },
            { $skip: +req.params.items },
            { $limit: 10 },
            { $group: {_id: '$_id', list: {$push: '$notifications'}}}
        ]).toArray()
        if (notifications) {
            res.status(200).send(notifications)
        } else {
            res.status(200).send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/update-tables', auth(), async (req, res) => {
    try {
        const update = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id), 'places._id': req.body._id },
            { $set: { 'places.$.tables': req.body.tables } }
        )
        res.status(200).send(true)
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/update-tg-tables', auth(), async (req, res) => {
    try {
        await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id),  ['telegram.' + req.body.data.placeId + '.chatId']: req.body.data.item.chatId },
            { $set: {    
                ["telegram." + req.body.data.placeId + ".$"]: { 
                    chatId: req.body.data.item.chatId, 
                    user: req.body.data.item.user,
                    notifications: req.body.data.item.notifications,
                    tables: req.body.data.item.tables
                } }
            }
        )

        res.status(200).send(true)
    } catch (error) {
        console.error(error)
    }
})


router.get('/api/check-place-link/:id', auth(), async (req, res) => {
    const check = await req.db.collection('users').findOne(
        { 'places.link': req.params.id }
    )
    if (check) {
        res.send(true)
    } else {
        res.send(false)
    }
})


router.post('/api/update-menu-link', auth(), async (req, res) => {
    try {
        const check = await req.db.collection('users').findOne(
            { 'places.link': req.body.data.link }
        )
        
        if (!check) {
            const add = await req.db.collection('users').updateOne(
                { _id: ObjectId(req.user._id), 'places._id': req.body.data.place._id },
                { $set: { 'places.$.link': req.body.data.link } }
            )
            if (add) {
                res.status(200).send({success: true})
            }
        } else {
            res.status(200).send({success: false, exists: true})
        }
        
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/subscribe', auth(), async (req, res) => {
    try {
        const currentPlan = moment(req.user.subscription[req.user.subscription.length - 1].expires).isBefore() ? moment()._d : req.user.subscription[req.user.subscription.length - 1].expires
        const sub = {
            type: req.body.data.type,
            started: currentPlan,
            expires: moment(currentPlan).add(req.body.data.month, 'month')._d,
            month: req.body.data.month,
            price: req.body.data.price
        }

        if (req.user.subscription[req.user.subscription.length - 1].type == req.body.data.type) {
            req.user.subscription[req.user.subscription.length - 1].expires = sub.expires
        } else {
            req.user.subscription.push(sub)
        }

        req.db.collection("users").updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { 'subscription': req.user.subscription } } )

        res.status(200).send(req.user.subscription)
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/improve', auth(), async (req, res) => {
    try {
        const started = req.user.subscription[req.user.subscription.length - 1].started
        const expires = req.user.subscription[req.user.subscription.length - 1].expires

        const diff = moment(expires).diff(started, 'hours', true) / 2

        req.user.subscription[req.user.subscription.length - 1].type = 'premium'
        req.user.subscription[req.user.subscription.length - 1].expires = moment(started).add(diff, 'hours')._d

        req.db.collection("users").updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { 'subscription': req.user.subscription } }
        )

        res.status(200).send(req.user.subscription)
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/simplify', auth(), async (req, res) => {
    try {
        const started = req.user.subscription[req.user.subscription.length - 1].started
        const expires = req.user.subscription[req.user.subscription.length - 1].expires

        const diff = moment(expires).diff(started, 'hours', true) * 2

        req.user.subscription[req.user.subscription.length - 1].type = 'standart'
        req.user.subscription[req.user.subscription.length - 1].expires = moment(started).add(diff, 'hours')._d

        req.db.collection("users").updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { 'subscription': req.user.subscription } }
        )

        res.status(200).send(req.user.subscription)
    } catch (error) {
        console.error(error)
    }
})


router.post('/api/set-currency', auth(), async (req, res) => {
    try {
        const set = req.db.collection("users").updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { 'currencySymbol': req.body.data } }
        )
        if (set) {
            res.status(200).send(true)
        } else {
            res.status(200).send(false)
        }
        
    } catch (error) {
        console.error(error)
    }
})


router.post('/api/load-tg-users', auth(), async (req, res) => {
    try {
        const user = await req.db.collection("users").findOne({ _id: ObjectId(req.user._id) })
        if (user) {
            res.status(200).json(user.telegram)
        } else {
            res.status(200).send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/toggle-fast-actions', auth(), async (req, res) => {
    try {
        const set = req.db.collection("users").updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { 'fastActionsEnabled': req.body.data } }
        )
        if (set) {
            res.status(200).send(true)
        } else {
            res.status(200).send(false)
        }
    } catch (error) {
        console.error(error)
    }
})


router.post('/api/complete-onboard', auth(), async (req, res) => {
    try {
        const set = req.db.collection("users").updateOne(
            { _id: ObjectId(req.user._id) },
            { $set: { 'isOnboardCompleted': true } }
        )
        if (set) {
            res.status(200).send(true)
        } else {
            res.status(200).send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/add-new-waiter', auth(), async (req, res) => {
    try {
        const waiter = await new WaiterModel(req.body)
        const add = await req.db.collection("users").updateOne(
            { _id: ObjectId(req.user._id) },
            { $push: { 'waiters': waiter } }
        )
        if (add.modifiedCount) {
            res.status(200).send(waiter)
        } else {
            res.status(200).send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/edit-waiter', auth(), async (req, res) => {
    try {
        const waiter = await new WaiterModel(req.body)

        const set = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id), "waiters._id": req.body._id },
            { $set: { "waiters.$": waiter } }
        )
        
        if (set) {
            const user = await req.db.collection("users").findOne({ _id: ObjectId(req.user._id) })
            console.log(user.waiters)
            res.status(200).send(user.waiters)
        } else {
            res.status(200).send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

router.delete('/api/delete-waiter/:id', auth(), async (req, res) => {
    try {
        const del = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id) },
            {'$pull': { "waiters": { "_id": req.params.id } } }
        )

        if (del.modifiedCount) {
            const user = await req.db.collection("users").findOne({ _id: ObjectId(req.user._id) })
            res.status(200).send(user.waiters)
        } else {
            res.status(200).send(false)
        }
    } catch (error) {
        console.error(error)
    }
})



router.post('/api/toggle-place-reservation', auth(), async (req, res) => {
    try {
        const set = await req.db.collection('users').updateOne(
            { _id: ObjectId(req.user._id), "places._id": req.body.place },
            { $set: { "places.$.reservationsEnabled": req.body.status } }
        )
        if (set.modifiedCount) {
            res.status(200).send(true)
        } else {
            res.status(200).send(false)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post('/api/payment', auth(), async (req, res) => {
    // try {
    //     console.log(req.body)
    //     console.log('got payment data')
    //     res.status(200).send('OK')
    // } catch (error) {
    //     console.error(error)
    // }


    try {
        console.log(req.body)
        const userId = req.body.OrderId.split('_')[0]
        const price = req.body.OrderId.split('_')[1]
        const type = req.body.OrderId.split('_')[2]
        const month = req.body.OrderId.split('_')[3]
        const user = await req.db.collection('users').findOne({ _id: ObjectId(userId) })

        const plans = {
            standart: {
                75000: {
                    month: 1
                },
                420000: {
                    month: 6
                },
                780000: {
                    month: 12
                }
            },
            premium: {
                150000: {
                    month: 1
                },
                840000: {
                    month: 6
                },
                1560000: {
                    month: 12
                }
            }
        }

        if (plans[type][req.body.Amount] && plans[type][req.body.Amount].month && plans[type][req.body.Amount].month == month) {
            if (user && req.body.Success && req.body.Status == "CONFIRMED") {
                const currentPlan = moment(user.subscription[user.subscription.length - 1].expires).isBefore() ? moment()._d : user.subscription[user.subscription.length - 1].expires
    
                const sub = {
                    type: type,
                    started: currentPlan,
                    expires: moment(currentPlan).add(month, 'month')._d,
                    month: month,
                    price: price
                }
    
                if (user.subscription[user.subscription.length - 1].type == type) {
                    user.subscription[user.subscription.length - 1].expires = sub.expires
                } else {
                    user.subscription.push(sub)
                }
        
                const updateSubscription = await req.db.collection("users").updateOne(
                    { _id: ObjectId(userId) },
                    { $set: { 'subscription': user.subscription } } )

                console.log(updateSubscription)

                if (updateSubscription.modifiedCount) {
                    websocket.updateSubscription({
                        sockets: user.sockets,
                        subscription: user.subscription
                    })
                }
            }
        }

        res.status(200).send("OK")
    } catch (error) {
        console.error(error)
    }


})

module.exports = router
