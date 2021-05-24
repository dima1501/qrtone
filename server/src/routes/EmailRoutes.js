const express = require('express')
const router = express.Router()

const nodemailer = require('nodemailer')
const { pugEngine } = require('nodemailer-pug-engine')
const smtpTransport = require('nodemailer-smtp-transport')

const auth = require('../middlewares/AuthMiddleware')

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    sendmail: true,
    auth: {
        user: "e13923d70a29d4",
        pass: "36e942d8a5528e",
    }
})

transporter.use(
    "compile",
    pugEngine({
        templateDir: "./src/email",
        pretty: true
    })
)

router.post("/api/send-reg-email", auth(), async (req, res) => {
    if (req.user) {
        console.log(req.user.email)
        const mailOptions = {
            from: "from@example.com",
            to: 'dima6343210@yandex.ru',
            subject: "Регистрация на QRTONE.COM",
            template: "registration-email",
            ctx: {
                name: req.user.name
            }
        }
        transporter.sendMail(mailOptions, async (error) => {
            if (error) {
                return console.error(error)
            }
            console.log(123)
        })
        res.sendStatus(200)
    } else {
        res.sendStatus(304)
    }
})

module.exports = router

