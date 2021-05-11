const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongodb').ObjectID

const websocket = require('../websocket')

const authGuest = require('../middlewares/AuthGuestMiddleware')

const OrderModel = require('../models/Order')

// telegram area
const Markup = require('telegraf/markup')
const bot = require('../../../bot/bot')
  
const acceptOrderBtn = Markup.inlineKeyboard([
    Markup.callbackButton('✅ Подтвердить заказ', 'accept')
]).extra()
// telegram area

router.post('/api/fast-action', authGuest(), async (req, res) => {
    try {
        const user = await req.db.collection('users').findOne({ _id: ObjectId(req.body.data.userId) })
        if (user) {
            const button = Markup.inlineKeyboard([
                Markup.callbackButton(req.body.data.buttonText, 'like')
            ]).extra()

            const notify = req.body.data.notifyText

            let data = {
                messages: [],
                chatId: [],
                messageId: [],
                guestId: req.user._id
            }
        
            if (user.telegram[req.body.data.place]) {
                for (let i = 0; i < user.telegram[req.body.data.place].length; i++) {
                    data.messages.push(await bot.sendMessage(user.telegram[req.body.data.place][i].chatId, `${notify.replace('@table', req.body.data.table)} \n`, button));
                    data.chatId.push( data.messages[i].chat.id )
                    data.messageId.push( data.messages[i].message_id )
                }
            }

            await req.db.collection('users').updateOne(
                { _id: ObjectId(req.body.data.userId) },
                { $push: { messages: data } }
            )

            res.status(200).send(true)
        }
    } catch (error) {
        console.error(error)
    }
})

router.get('/api/get-user-data/:id/:place', async (req, res) => {
    const user = await req.db.collection('users').findOne({ _id: ObjectId(req.params.id) })
    if (user) {
        const publicUser = {
            _id: ObjectId(req.params.id),
            name: user.name,
            goods: user.goods.filter(e => e.places.find(e => e._id == req.params.place)),
            photo: user.photo,
            background: user.background,
            categories: user.categories,
            places: user.places,
            actions: user.actions
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
        { $push: { 'orders': order } }
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

    const getOrderPrice = (order) => {
        let total = 0
        for (let i of order.goods) {
            for (let n in i.cartPrices) {
                total += +i.prices[i.cartPrices[n]]
            }
        }
        return total
    }

    const getCustomArr = (arr) => {
        const newArr = []
        for (let i in arr) {
            if (newArr.indexOf(arr[i]) == -1) {
                newArr.push(arr[i])
            }
        }
        return newArr.sort(function(a, b) { return a - b })
    }

    let str = []
    for (let i = 0; i < order.goods.length; i++) {
        str.push(`${i + 1}) ${order.goods[i].name}\n`)
        for (let n = 0; n < getCustomArr(order.goods[i].cartPrices).length; n++) {
            str.push(`${order.goods[i].prices[order.goods[i].cartPrices[n]]}р ${order.goods[i].weights[order.goods[i].cartPrices[n]]}г x ${order.goods[i].cartPrices.filter(e => e == order.goods[i].cartPrices[n]).length } \n`)
            str.push(`-----\n`)
        }
    }

    str.push(`\n ${getOrderPrice(order)}p `)

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
    const orders = await req.db.collection("users").aggregate([
        { $match: { _id: ObjectId(req.body.data) } },
        { $unwind: '$orders' },
        { $match: {'orders.guestId': req.user._id } },
        { $sort: { 'orders.timestamp': 1 } },
        { $group: {_id: '$_id', list: {$push: '$orders'} } }
    ]).toArray()

    if (orders[0] && orders[0].list) {
        res.status(200).json(orders[0].list)
    } else {
        res.status(200).json([])
    }
})

module.exports = router
