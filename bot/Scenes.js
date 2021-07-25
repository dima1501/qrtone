const Scene = require('telegraf/scenes/base')

const { ObjectId } = require('mongodb')

const Telegraf = require('telegraf')
const {Extra,  Markup, Stage, session } = Telegraf

const api = require("../server/src/websocket")

class SceneGenerator {

    logoutScene () {
        const sc = new Scene('logout')

        sc.enter(async ctx => {
            const db = ctx.scene.session.state.db
            const user = await db.collection('tgUsers').findOne({_id: Number.parseInt(ctx.update.message.chat.id)})

            if (!user.login) {
                await ctx.reply('Вход не выполнен, воспользуйтесь командой /login')
                await ctx.scene.leave()
            } else if (user) {
                await ctx.reply('Чтобы подтвердить выход нажмите /exit, для отмены - /cancel')
            } else {
                await ctx.reply('Вход не выполнен, для подключения воспользуйтесь командой /login')
                await ctx.scene.leave()
            }
        })

        sc.hears('/cancel', async ctx => {
            await ctx.reply('Отменено')
            await ctx.scene.leave()
        })

        sc.hears('/exit', async ctx => {
            const db = ctx.scene.session.state.db
            const user = await db.collection('tgUsers').findOne({_id: Number.parseInt(ctx.update.message.chat.id)})
            let company = null
            if (user) {
                company = await db.collection('users').findOne({_id: ObjectId(user.companyId) })
            }
            

            for (let i in company.places) {
                await db.collection('users').updateOne(
                    { _id: ObjectId(company._id) },
                    { $pull: {
                        ["telegram." + company.places[i]._id]: { 'chatId': Number.parseInt(ctx.update.message.chat.id) }
                    }}
                )
            }
            
            await db.collection('tgUsers').updateOne(
                { _id: Number.parseInt(ctx.update.message.chat.id) },
                { $set: {
                    login: false,
                }}, 
                { upsert: true }
            )
            if (company.publicSockets) {
                api.newTGUser({ sockets: company.publicSockets })
            }
            await ctx.reply('Вы вышли из аккаунта. Для подключения пользуйтесь командой /login')
            await ctx.scene.leave()
        })

        return sc
    }

    changeScene () {
        const sc = new Scene('change')

        sc.action(/^[chan,-]+(-[^\>]*)?$/, async ctx => {
            const placeId = ctx.match[0].split(',-')[1]
            const userId = ctx.match[0].split(',-')[2]
            const chatId = Number.parseInt(ctx.match[0].split(',-')[3])
            const user = await ctx.scene.session.state.db.collection('users').findOne({ _id: ObjectId(userId) })

            await ctx.scene.session.state.db.collection('users').updateOne(
                { _id: ObjectId(userId) },
                { $push: {
                    ["telegram." + placeId]: { 
                        chatId: chatId, 
                        user: ctx.update.callback_query.from,
                        notifications: 'all',
                        tables: []
                    } }
                }
            )

            await ctx.scene.session.state.db.collection('tgUsers').updateOne(
                { _id: chatId },
                { $set: {
                    place: placeId,
                }}, 
                { upsert: true }
            )
            if (user.publicSockets) {
                api.newTGUser({ sockets: user.publicSockets })
            }
            await ctx.reply("Заведение успешно изменено!) Для смены заведения используйте команду /change")
            await ctx.scene.leave()
        })

        sc.enter(async (ctx) => {
            const db = ctx.scene.session.state.db
            const user = await db.collection('tgUsers').findOne({_id: Number.parseInt(ctx.update.message.chat.id) })
            let company = null
            if (user) {
                company = await db.collection('users').findOne({_id: ObjectId(user.companyId) })
            }
            
            if (!user || !user.login) {
                await ctx.reply('Вход не выполнен, воспользуйтесь командой /login')
            } else {
                for (let i in company.places) {
                    await db.collection('users').updateOne(
                        { _id: ObjectId(company._id) },
                        { $pull: {
                            ["telegram." + company.places[i]._id]: { 'chatId': Number.parseInt(ctx.update.message.chat.id) }
                        }}
                    )
                }
                
                const buttons = await company.places.map(key => Markup.callbackButton(key.name, `chan,-${key._id},-${company._id},-${ctx.update.message.chat.id}`))
                await ctx.reply('Теперь выберите заведение:', Extra.HTML().markup((m) => m.inlineKeyboard(buttons)))
            }
        })

        return sc
    }

    loginScene () {
        const sc = new Scene('login')

        sc.enter(async (ctx) => {
            const db = ctx.scene.session.state.db
            const user = await db.collection('tgUsers').findOne({_id: ctx.update.message.chat.id})

            if (user && user.login) {
                await ctx.reply('Вход уже выполнен, для смены заведения воспользуйтесь командами /logout и /login')
                await ctx.scene.leave()
            } else {
                await ctx.reply('Введите код доступа, который указан в личном кабинете. /cancel для отмены')
            }
            
        })
        sc.hears('/cancel', async ctx => {
            await ctx.reply('Отменено')
            await ctx.scene.leave()
        })

        sc.action(/^[check,-]+(-[^\>]*)?$/, async ctx => {
            const placeId = ctx.match[0].split(',-')[1]
            const userId = ctx.match[0].split(',-')[2]
            const chatId = Number.parseInt(ctx.match[0].split(',-')[3])
            const user = await ctx.scene.session.state.db.collection('users').findOne({ _id: ObjectId(userId) })

            await ctx.scene.session.state.db.collection('users').updateOne(
                { _id: ObjectId(userId) },
                { $push: {
                    ["telegram." + placeId]: { 
                        chatId: chatId, 
                        user: ctx.update.callback_query.from,
                        notifications: 'all',
                        tables: []
                    } }
                }
            )

            await ctx.scene.session.state.db.collection('tgUsers').updateOne(
                { _id: chatId },
                { $set: {
                    login: true, 
                    place: placeId,
                    companyId: userId,
                }}, 
                { upsert: true }
            )
            if (user.publicSockets) {
                api.newTGUser({ sockets: user.publicSockets })
            }
            await ctx.reply("Вход успешно выполнен, теперь вы будете получать уведомления от гостей!) Для смены заведения используйте команду /change")
            await ctx.scene.leave()
        })

        sc.on('text', async ctx => {

            const db = ctx.scene.session.state.db
            const user = await db.collection('users').findOne({bot_token: ctx.update.message.text})

            let find = false
            if (user) {
                for (let i in user.telegram) {
                    if (user.telegram[i].find(x => x.chatId == Number.parseInt(ctx.update.message.chat.id))) {
                        ctx.session.currentPlaceId = i
                        find = true
                    }
                }
            }

            if (find) {
                await ctx.scene.session.state.db.collection('users').updateOne(
                    { _id: ObjectId(user._id) },
                    { $push: {
                        ["telegram." + user.places[0]._id]: {
                            chatId: Number.parseInt(ctx.update.message.chat.id), 
                            user: ctx.update.message.from,
                            notifications: 'all',
                            tables: []
                        } }
                    }
                )

                await ctx.scene.session.state.db.collection('tgUsers').updateOne(
                    { _id: Number.parseInt(ctx.update.message.chat.id) },
                    { $set: {
                        login: true, 
                    }}, 
                    { upsert: true }
                )
                if (user.publicSockets) {
                    api.newTGUser({ sockets: user.publicSockets })
                }
                await ctx.reply('Вход успешно выполнен, заведение: ' + user.places[0].name)
                await ctx.scene.leave()
            }

            if (user && !find) {
                if (user.places.length > 1) {
                    const buttons = await user.places.map(key => Markup.callbackButton(key.name, `check,-${key._id},-${user._id},-${ctx.update.message.chat.id}`))
                    await ctx.reply('Теперь выберите заведение:', Extra.HTML().markup((m) => m.inlineKeyboard(buttons)))
                } else {
                    await ctx.scene.session.state.db.collection('users').updateOne(
                        { _id: ObjectId(user._id) },
                        { $push: {
                            ["telegram." + user.places[0]._id]: {
                                chatId: Number.parseInt(ctx.update.message.chat.id), 
                                user: ctx.update.message.from,
                                notifications: 'all',
                                tables: []
                            } }
                        }
                    )
                    await ctx.scene.session.state.db.collection('tgUsers').updateOne(
                        { _id: Number.parseInt(ctx.update.message.chat.id) },
                        { $set: {
                            login: true, 
                            place: user.places[0]._id,
                            companyId: user._id,
                        }}, 
                        { upsert: true }
                    )
                    if (user.publicSockets) {
                        api.newTGUser({ sockets: user.publicSockets })
                    }
                    await ctx.reply("Вход успешно выполнен, теперь вы будете получать уведомления от гостей!)")
                    await ctx.scene.leave()
                }
            } else if (!user) {
                ctx.replyWithHTML("<b>Заведение не найдено, проверьте правильность кода и попробуйте еще раз</b>")
            }
        })

        return sc
    }
}

module.exports = SceneGenerator