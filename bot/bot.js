require("dotenv").config({ path: "../.env" })

const Telegraf = require('telegraf')
const {Extra,  Markup, Stage, session } = Telegraf
const { MongoClient, ObjectId } = require('mongodb')

const SceneGenerator = require('./Scenes')

const bot = new Telegraf(process.env.TELEGRAF_TOKEN, {polling: true})
const api = require("../server/src/websocket")

const curScene = new SceneGenerator()

const loginScene = curScene.loginScene()
const changeScene = curScene.changeScene()
const logoutScene = curScene.logoutScene()

const stage = new Stage([loginScene, changeScene, logoutScene])

bot.use(session())
bot.use(stage.middleware())

MongoClient.connect(process.env.DB_URI, { useUnifiedTopology: true }).then(async (client) => {
  const db = await client.db();
  
  bot.hears('/login', async ctx => {
    ctx.scene.enter('login', { db: db })
  })

  bot.hears('/change', async ctx => {
    ctx.scene.enter('change', { db: db })
  })

  bot.hears('/logout', async ctx => {
    ctx.scene.enter('logout', { db: db })
  })

  bot.action('like', async (ctx) => {
    try {
      const tgUser = await db.collection('tgUsers').findOne({_id: ctx.update.callback_query.message.chat.id})
      const user = await db.collection("users").aggregate([
        { $match: { _id: ObjectId(tgUser.companyId) } },
        { $unwind: '$notifications'},
        { $match: {'notifications.chatId': {$in: [ctx.update.callback_query.message.chat.id]}}},
        { $match: {'notifications.messageId': {$in: [ctx.update.callback_query.message.message_id]}}},
        { $group: {_id: '$_id', list: {$push: '$notifications'}, sockets: {$push: '$sockets'}, id: {$push: '$_id'} } }
      ]).toArray()

      if (user[0]) {
        for (let i = 0; i < user[0].list[0].messages.length; i++) {
          api.acceptFastActionTelegram({ sockets: user[0].sockets[0], data: { _id: user[0].list[0]._id } })
          ctx.telegram.editMessageText(
            user[0].list[0].messages[i].chat.id,
            user[0].list[0].messages[i].message_id,
            user[0].list[0].messages[i].message_id,
            `${ctx.update.callback_query.message.text}, ${user[0].list[0].messages[i].chat.first_name} откликнулся`,
          );
        }
      }
    } catch (error) {
      console.error(error)
    }
  })

  bot.action('accept', async (ctx) => {
    try {
      const tgUser = await db.collection('tgUsers').findOne({_id: ctx.update.callback_query.message.chat.id})
      const user = await db.collection("users").aggregate([
        { $match: { _id: ObjectId(tgUser.companyId) } },
        { $unwind: '$messages'},
        { $match: {'messages.chatId': {$in: [ctx.update.callback_query.message.chat.id]}}},
        { $match: {'messages.messageId': {$in: [ctx.update.callback_query.message.message_id]}}},
        { $group: {_id: '$_id', list: {$push: '$messages'}, sockets: {$push: '$sockets'},  } }
      ]).toArray()

      if (user[0]) {
        for (let i = 0; i < user[0].list[0].messages.length; i++) {
          api.acceptOrderTelegram({ sockets: user[0].sockets, orderId: user[0].list[0].orderId, guestId: user[0].list[0].guestId })
          ctx.telegram.editMessageText(
            user[0].list[0].messages[i].chat.id,
            user[0].list[0].messages[i].message_id,
            user[0].list[0].messages[i].message_id,
            `${ctx.update.callback_query.message.text.replace('⏳', '✅')}`,
          );
        }
      }
    } catch (error) {
      console.error(error)
    }
  })

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
  bot.launch()
});

module.exports = bot.telegram
