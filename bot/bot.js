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
    // const user = await db.collection("users").findOne({bot_token: ctx.session.userId})
    const user = await db.collection("users").aggregate({ $match: {"messages.chat.id" : ctx.update.callback_query.message.chat.id}}).toArray()

    if (user) {
      for (let i = 0; i < user[0].messages.length; i++) {
        if (user[0].messages[i].find(e => e.message_id === ctx.update.callback_query.message.message_id && e.chat.id === ctx.update.callback_query.message.chat.id)) {
          for (let q = 0; q < user[0].messages[i].length; q++) {
            ctx.telegram.editMessageText(
              user[0].messages[i][q].chat.id,
              user[0].messages[i][q].message_id,
              user[0].messages[i][q].message_id,
              `${ctx.update.callback_query.message.text.replace("🙋🏼‍♂️", "✅")} ${user[0].messages[i][q].chat.first_name} откликнулся`,
            );
          }
        }
      }
    }
  })

  bot.action('accept', async (ctx) => {
    try {
      const user = await db.collection("users").aggregate([
        { $match: { bot_token: ctx.session.bot_token } },
        { $unwind: '$messages'},
        { $match: {'messages.chatId': {$in: [ctx.update.callback_query.message.chat.id]}}},
        { $match: {'messages.messageId': {$in: [ctx.update.callback_query.message.message_id]}}},
        { $group: {_id: '$_id', list: {$push: '$messages'}, sockets: {$push: '$sockets'}}}
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
