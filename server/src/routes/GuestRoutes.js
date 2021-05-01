const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongodb').ObjectID

const websocket = require('../websocket')

const authGuest = require('../middlewares/AuthGuestMiddleware')

const OrderModel = require('../models/Order')

// telegram area
const Markup = require('telegraf/markup')
const bot = require('../../../bot/bot')

const callSomebodyBtn = Markup.inlineKeyboard([
    Markup.callbackButton('🏃 Уже бегу', 'like')
]).extra()
  
const acceptOrderBtn = Markup.inlineKeyboard([
    Markup.callbackButton('✅ Подтвердить заказ', 'accept')
]).extra()
// telegram area

router.get('/api/get-user-data/:id', async (req, res) => {
    const user = await req.db.collection('users').findOne({ _id: ObjectId(req.params.id) })
    if (user) {
        const publicUser = {
            _id: ObjectId(req.params.id),
            name: user.name,
            goods: user.goods,
            photo: user.photo,
            background: user.background,
            categories: user.categories,
            places: user.places
        }
        res.status(200).send(publicUser)
    }
})

router.post('/api/update-cart', authGuest(), async (req, res) => {
    const update = await req.db.collection('guests').updateOne(
        { _id: ObjectId(req.user._id) },
        { $set: { 'cart': req.body.data } }
    )
    if (update) {
        res.status(200).send(true)
    }
})

router.post('/api/make-order', authGuest(), async (req, res) => {

    const order = new OrderModel(req.user._id, req.body.data.order)

    const makeOrder = await req.db.collection('users').updateOne(
        { _id: ObjectId(req.body.data.id) },
        { $push: { ['orders.' + req.user._id]: order } }
    )
    const clearCart = await req.db.collection('guests').updateOne(
        { _id: ObjectId(req.user._id) },
        { $set: { 'cart': [] } }
    )

    const user = await req.db.collection('users').findOne({ _id: ObjectId(req.body.data.id) })

    if (user.sockets.length) {
        websocket.makeOrder({
            sockets: user.sockets,
            order: order,
            id: req.user._id
        })
    }

    let str = []
    for (let i = 0; i < order.goods.length; i++) {
        str.push(`${i + 1}) ${order.goods[i].name}, ${order.goods[i].price}р., x${order.goods[i].count}\n-----------------------------\n`)
    }

    let data = {
        messages: [],
        chatId: [],
        messageId: [],
        orderId: order.orderId,
        guestId: req.user._id
    }

    if (user.telegram[order.place]) {
        for (let i = 0; i < user.telegram[order.place].length; i++) {
            data.messages.push(await bot.sendMessage(user.telegram[order.place][i].chatId, `⏳ Новый заказ, ${order.table} столик \n\n${str.join('')}`, acceptOrderBtn));
            data.chatId.push( data.messages[i].chat.id )
            data.messageId.push( data.messages[i].message_id )
        }
    }

    await req.db.collection('users').updateOne(
        { _id: ObjectId(req.body.data.id) },
        { $push: { messages: data } }
    )
    
    if (makeOrder && clearCart) {
        res.status(200).json(order)
    }
})

router.post('/api/load-orders', authGuest(), async (req, res) => {
    const orders = await req.db.collection('users').findOne(
        { _id: ObjectId(req.body.data) }
    )
    if (orders.orders[req.user._id]) {
        res.status(200).json(orders.orders[req.user._id])
    } else {
        res.status(200).json([])
    }
})

module.exports = router
