const Scene = require('telegraf/scenes/base')

const { ObjectId } = require('mongodb')

const Telegraf = require('telegraf')
const {Extra,  Markup, Stage, session } = Telegraf

class SceneGenerator {

    logoutScene () {
        const sc = new Scene('logout')

        sc.enter(async ctx => {
            if (!ctx.session.login) {
                await ctx.reply('Вход не выполнен, воспользуйтесь командой /login')
                await ctx.scene.leave()
            } else {
                const db = ctx.scene.session.state.db

                const user = await db.collection('users').findOne({bot_token: ctx.session.bot_token})

                if (user) {
                    await ctx.reply('Чтобы подтвердить выход нажмите /exit, для отмены - /cancel')
                } else {
                    await ctx.reply('Вход не выполнен, для подключения воспользуйтесь командой /login')
                    await ctx.scene.leave()
                }
            }
            
        })

        sc.hears('/cancel', async ctx => {
            await ctx.reply('Отменено')
            await ctx.scene.leave()
        })

        sc.hears('/exit', async ctx => {
            const db = ctx.scene.session.state.db
            const user = await db.collection('users').findOne({bot_token: ctx.session.bot_token})

            await db.collection('users').updateOne(
                { bot_token: ctx.session.bot_token },
                { $pull:{['telegram.' + ctx.session.currentPlaceId]: { 'chatId' : '' + ctx.update.message.chat.id } } } )
            
            ctx.session.bot_token = false
            ctx.session.login = false
            ctx.session.currentPlaceId = false

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
            const chatId = ctx.match[0].split(',-')[3]

            ctx.session.currentPlaceId = placeId

            await ctx.scene.session.state.db.collection('users').updateOne(
                { _id: ObjectId(userId) },
                { $push: {
                    ["telegram." + placeId]: { chatId: chatId, user: ctx.update.callback_query.from } }
                }
            )
            await ctx.reply("Заведение успешно изменено!) Для смены заведения используйте команду /change")
            await ctx.scene.leave()
        })

        sc.enter(async (ctx) => {
            if (!ctx.session.login) {
                await ctx.reply('Вход не выполнен, воспользуйтесь командой /login')
            } else {
                const db = ctx.scene.session.state.db
                const user = await db.collection('users').findOne({ bot_token: ctx.session.bot_token })
      
                if (user && user.places.length === 1) {
                    await ctx.reply('Доступно только 1 заведение')
                    await ctx.scene.leave()
                } else if (user) {
                    for (let i in user.places) {
                        await db.collection('users').updateOne(
                            { _id: ObjectId(user._id) },
                            { $pull: {
                                ["telegram." + user.places[i]._id]: { 'chatId': '' + ctx.update.message.chat.id }
                            }}
                        )
                    }
                    
                    const buttons = await user.places.map(key => Markup.callbackButton(key.name, `chan,-${key._id},-${user._id},-${ctx.update.message.chat.id}`))
                    await ctx.reply('Теперь выберите заведение:', Extra.HTML().markup((m) => m.inlineKeyboard(buttons)))
                }
            }
        })

        return sc
    }

    loginScene () {
        const sc = new Scene('login')
        sc.enter(async (ctx) => {
            if (ctx.session.login) {
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
            const chatId = ctx.match[0].split(',-')[3]

            ctx.session.currentPlaceId = placeId

            await ctx.scene.session.state.db.collection('users').updateOne(
                { _id: ObjectId(userId) },
                { $push: {
                    ["telegram." + placeId]: { chatId: chatId, user: ctx.update.callback_query.from } }
                }
            )
            await ctx.reply("Вход успешно выполнен, теперь вы будете получать уведомления от гостей!) Для смены заведения используйте команду /change")
            ctx.session.login = true
            await ctx.scene.leave()
        })

        sc.on('text', async ctx => {

            const db = ctx.scene.session.state.db
            const user = await db.collection('users').findOne({bot_token: ctx.message.text})

            let find = false
            if (user) {
                for (let i in user.telegram) {
                    if (user.telegram[i].find(x => x.chatId == ctx.update.message.chat.id)) {
                        ctx.session.currentPlaceId = i
                        find = true
                    }
                }
            }

            if (find) {
                ctx.session.login = true
                ctx.session.bot_token = ctx.message.text
                await ctx.reply('Вход успешно выполнен')
                await ctx.scene.leave()
            }

            if (user && !find) {
                ctx.session.bot_token = ctx.message.text
                if (user.places.length > 1) {
                    const buttons = await user.places.map(key => Markup.callbackButton(key.name, `check,-${key._id},-${user._id},-${ctx.update.message.chat.id}`))
                    await ctx.reply('Теперь выберите заведение:', Extra.HTML().markup((m) => m.inlineKeyboard(buttons)))
                } else {
                    await ctx.scene.session.state.db.collection('users').updateOne(
                        { _id: ObjectId(user._id) },
                        { $push: {
                            ["telegram." + user.places[0]._id]: { chatId: ctx.update.message.chat.id, user: ctx.update.message.from } }
                        }
                    )
                    await ctx.reply("Вход успешно выполнен, теперь вы будете получать уведомления от гостей!)")

                    ctx.session.login = true
                    ctx.session.currentPlaceId = user.places[0]._id

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