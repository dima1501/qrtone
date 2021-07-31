const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongodb').ObjectID

const websocket = require('../websocket')

const authGuest = require('../middlewares/AuthGuestMiddleware')

const OrderModel = require('../models/Order')
const { nanoid } = require('nanoid')

// telegram area
const Markup = require('telegraf/markup')
const bot = require('../../../bot/bot')
  
const acceptOrderBtn = Markup.inlineKeyboard([
    Markup.callbackButton('✅ Подтвердить заказ', 'accept')
]).extra()
// telegram area

router.post('/api/fast-action', authGuest(), async (req, res) => {
    try {
        const user = await req.db.collection('users').findOne({ 'places.link': req.body.data.userId })
        const place = user.places.find(e => e.link == req.body.data.userId)

        if (user) {
            const button = Markup.inlineKeyboard([
                Markup.callbackButton('Принято', 'like')
            ]).extra()

            const notify = req.body.data.notifyText

            let data = {
                _id: nanoid(),
                messages: [],
                chatId: [],
                messageId: [],
                guestId: req.user._id,
                notify: notify,
                table: req.body.data.table,
                status: 'pending',
                buttonText: req.body.data.buttonText,
                place: place._id,
                timestamp: Date.now()
            }

            if (user.telegram[place._id]) {
                for (let i = 0; i < user.telegram[place._id].length; i++) {
                    const table = typeof req.body.data.table == 'number' ? req.body.data.table : req.body.data.table.replace(' ', '%20')
                    if (user.telegram[place._id][i].notifications == 'all' || user.telegram[place._id][i].tables.indexOf(table) > -1) {
                        data.messages.push(await bot.sendMessage(user.telegram[place._id][i].chatId, `${notify.replace('@table', req.body.data.table)} \n`, button));
                        data.chatId.push( data.messages[i].chat.id )
                        data.messageId.push( data.messages[i].message_id )
                    }
                }
            }

            if (user.sockets.length) {
                websocket.fastAction({
                    sockets: user.sockets.filter(e => e.place == place._id),
                    data
                })
            }

            await req.db.collection('users').updateOne(
                { 'places.link': req.body.data.userId },
                { $push: { notifications: data } },
            )

            res.status(200).send(true)
        }
    } catch (error) {
        console.error(error)
    }
})

router.get('/api/get-user-data/:id', async (req, res) => {
    const user = await req.db.collection('users').findOne(
        { 'places.link': req.params.id }
    )
    if (user) {
        const place = user.places.find(e => e.link == req.params.id)
        const publicUser = {
            _id: ObjectId(user._id),
            name: user.name,
            description: user.description,
            goods: user.goods.filter(e => e.places.find(e => e == place._id)),
            photo: user.photo,
            background: user.background,
            categories: user.categories,
            place: place,
            actions: user.actions,
            currencySymbol: user.currencySymbol,
            subscription: user.subscription,
            fastActionsEnabled: user.fastActionsEnabled,
            dops: user.dops,
            waiters: user.waiters.filter(e => e.places.find(e => e == place._id))
        }
        res.status(200).send(publicUser)
    } else {
        res.status(200).send(false)
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
    const user = await req.db.collection('users').findOne({ 'places.link': req.body.data.order.place })

    const place = user.places.find(e => e.link == req.body.data.order.place)

    const order = new OrderModel(req.user._id, req.body.data.order, place._id)

    const makeOrder = await req.db.collection('users').updateOne(
        { _id: ObjectId(user._id) },
        { $push: {
            'orders': { 
                $each: [order],
                $position: 0
            }
        } }
    )

    const clearCart = await req.db.collection('guests').updateOne(
        { _id: ObjectId(req.user._id) },
        { $set: { ['cart.' + place._id]: { goods: [], dops: [] } } }
    )

    if (user.sockets.length) {
        websocket.makeOrder({
            sockets: user.sockets.filter(e => e.place == place._id),
            order: order,
            id: req.user._id
        })
    }

    const getOrderPrice = (order) => {
        let total = 0
        for (let o of ['goods', 'dops']) {
            for (let i of order[o]) {
                for (let n in i.cartPrices) {
                    total += +i.prices[i.cartPrices[n]]
                }
            }
        }
        return total
    }

    getOrderPrice(order)

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
            // Если есть модификация
            str.push('    ')
            if (order.goods[i].modifications && order.goods[i].modifications[n]) {
                str.push(`${order.goods[i].modifications[n]}, `)
            }

            str.push(`${order.goods[i].prices[n]}${user.currencySymbol}`)

            // Если указан вес
            if (order.goods[i].weights[n]) {
                str.push(`, `)
                str.push(`${order.goods[i].weights[n]}г`)
            }

            str.push(` | x ${order.goods[i].cartPrices.filter(e => e == order.goods[i].cartPrices[n]).length} \n`)

            // str.push(`${order.goods[i].prices[order.goods[i].cartPrices[n]]}${user.currencySymbol} ${order.goods[i].weights[order.goods[i].cartPrices[n]]}г x ${order.goods[i].cartPrices.filter(e => e == order.goods[i].cartPrices[n]).length } \n`)
            if (n !== getCustomArr(order.goods[i].cartPrices).length - 1) {
                str.push(`     -----\n`)
            }
        }
        str.push(`----------------\n`)
    }

    // Дополнения
    if (order.dops.length) {
        
        str.push(`Дополнения\n`)
        str.push(`\n`)
    }

    for (let i = 0; i < order.dops.length; i++) {
        str.push(`${i + 1}) ${order.dops[i].name} `)
        if (order.dops[i].prices[0]) {
            str.push(', ')
            str.push(`${order.dops[i].prices[0]}${user.currencySymbol}`)
        }
        str.push(` | x ${order.dops[i].count} \n`)

        str.push(`-----------\n`)
    }

    str.push(`\n Итого: ${order.price}${user.currencySymbol} `)

    let data = {
        messages: [],
        chatId: [],
        messageId: [],
        orderId: order.orderId,
        guestId: req.user._id
    }

    if (user.telegram[order.place]) {
        for (let i = 0; i < user.telegram[order.place].length; i++) {
            const table = typeof order.table == 'number' ? order.table : order.table.replace(' ', '%20')
            if (user.telegram[order.place][i].notifications == 'all' || user.telegram[order.place][i].tables && user.telegram[order.place][i].tables.indexOf(table) > -1) {
                data.messages.push(await bot.sendMessage(user.telegram[order.place][i].chatId, `⏳ Новый заказ, столик #${order.table}  \n\n${str.join('')}`, acceptOrderBtn));
                data.chatId.push( data.messages[i].chat.id )
                data.messageId.push( data.messages[i].message_id )
            }
        }
    }

    await req.db.collection('users').updateOne(
        { 'places.link': req.body.data.order.place },
        { $push: { messages: data } }
    )
    
    if (makeOrder && clearCart) {
        res.status(200).json(order)
    }
})

router.post('/api/load-orders', authGuest(), async (req, res) => {
    const user = await req.db.collection('users').findOne({ 'places.link': req.body.data })

    if (user) {
        const orders = await req.db.collection("users").aggregate([
            { $match: { 'places.link': req.body.data } },
            { $unwind: '$orders' },
            { $match: {'orders.guestId': ObjectId(req.user._id) } },
            { $sort: { 'orders.timestamp': -1 } },
            { $group: {_id: '$_id', list: {$push: '$orders'} } }
        ]).toArray()
        if (orders[0] && orders[0].list) {
            res.status(200).json(orders[0].list)
        } else {
            res.status(200).json([])
        }
    } else {
        res.status(200).json([])
    }
    
})

router.get('/api/get-place-id/:id', async (req, res) => {
    try {
        const user = await req.db.collection("users").findOne(
            {  'places._id': req.params.id }
        )
        const place = user.places.find(e => e._id == req.params.id)

        res.status(200).send(place.link)
    } catch (error) {
        console.error(error)
    }
})

// router.post('/api/reserve', async (req, res) => {
//     try {
//         console.log(req.body)

//         res.send(true)
//     } catch (error) {
//         console.error(error)
//     }
// })

router.post('/api/reserve', authGuest(), async (req, res) => {
    try {
        var moment = require('moment')

        const user = await req.db.collection('users').findOne({ 'places.link': req.body.place })
        const place = user.places.find(e => e.link == req.body.place)

        if (user) {
            const button = Markup.inlineKeyboard([
                Markup.callbackButton('Принято', 'like')
            ]).extra()

        //     const notify = req.body.data.notifyText

            let data = {
                _id: nanoid(),
                messages: [],
                chatId: [],
                messageId: [],
                guestId: req.user._id,
                status: 'pending',
                place: place._id,
                timestamp: Date.now(),
                reservation: req.body
            }

            let str = []
            str.push(`${ moment(req.body.date).format('DD.MM.YYYY') }, в ${ req.body.time }\n`)
            str.push(`${ req.body.comment }\n`)
            str.push(`${ req.body.phone }, ${ req.body.name }\n`)

            if (user.telegram[place._id]) {
                for (let i = 0; i < user.telegram[place._id].length; i++) {
                    if (user.telegram[place._id][i].notifications == 'all') {
                        data.messages.push(await bot.sendMessage(user.telegram[place._id][i].chatId, `⏳ Заявка на бронирование \n\n${str.join('')}`, button));
                        data.chatId.push( data.messages[i].chat.id )
                        data.messageId.push( data.messages[i].message_id )
                    }
                }
            }

            if (user.sockets.length) {
                websocket.newReservation({
                    sockets: user.sockets.filter(e => e.place == place._id),
                    data
                })
            }

            await req.db.collection('users').updateOne(
                { 'places.link': req.body.place },
                { $push: { notifications: data } },
            )

            res.status(200).send(true)
        }
    } catch (error) {
        console.error(error)
    }
})

module.exports = router
