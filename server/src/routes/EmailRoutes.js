const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const { pugEngine } = require('nodemailer-pug-engine')
const auth = require('../middlewares/AuthMiddleware')
const moment = require('moment')

// const transporter = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: "e13923d70a29d4",
//         pass: "36e942d8a5528e",
//     }
// });

const transporter = nodemailer.createTransport({
    host: "smtp-relay.gmail.com",
    secureConnection: true,
    port: 587,
    auth: {
      user: "admin@toffee.menu",
      pass: "WHPac_ua3!"
    }
});

transporter.use(
    "compile",
    pugEngine({
        templateDir: "./src/email/templates",
        pretty: true
    })
)

router.post("/api/send-reg-email", auth(), async (req, res) => {
    if (req.user) {
        const mailOptions = {
            from: "admin@toffee.menu",
            to: req.user.email,
            subject: "Регистрация на toffee.menu",
            template: "registration-email",
            ctx: {
                name: req.user.name,
                plan: moment(req.user.subscription[0].expires).format('DD.MM.YYYY')
            }
        }
        transporter.sendMail(mailOptions, async (error) => {
            if (error) {
                return console.error(error)
            }
        })
        res.sendStatus(200)
    } else {
        res.sendStatus(304)
    }
})

router.post("/api/send-restore-email", async (req, res) => {
    const user = await req.db.collection("users").findOne({ email: req.body.data.email })
    if (user) {
        const code = Math.floor(100000 + Math.random() * 900000)
        const mailOptions = {
            from: "admin@toffee.menu",
            to: req.body.data.email,
            subject: "Восстановление пароля на toffee.menu",
            template: "restore-email",
            ctx: {
                name: user.name,
                code: code
            }
        }

        const setSecretCode = await req.db.collection("users").updateOne(
            { email: req.body.data.email },
            { $set: { restoreCode: code } }
        )

        transporter.sendMail(mailOptions, async (error) => {
            if (error) {
                return console.error(error)
            }
        })

        res.send(true)
    } else {
        res.send(false)
    }
})

router.post("/api/send-subscription-email", auth(), async (req, res) => {
    if (req.user) {
        const mailOptions = {
            from: "admin@toffee.menu",
            to: req.user.email,
            subject: "Подписка на toffee.menu успешно оформлена ",
            template: "subscription-email",
            ctx: {
                name: req.user.name,
                type: req.body[req.body.length - 1].type,
                start: moment(req.body[req.body.length - 1].started).format('DD.MM.YYYY'),
                price: req.body[req.body.length - 1].price,
                end: moment(req.body[req.body.length - 1].expires).format('DD.MM.YYYY')
            }
        }
        transporter.sendMail(mailOptions, async (error) => {
            if (error) {
                return console.error(error)
            }
        })
        res.sendStatus(200)
    } else {
        res.sendStatus(304)
    }
})

module.exports = router

