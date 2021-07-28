const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongodb').ObjectID

const auth = require('../middlewares/AuthMiddleware')
const authGuest = require('../middlewares/AuthGuestMiddleware')

const UserService = require('../services/UserService')
const SessionService = require('../services/SessionService')

const crypto = require('crypto')

const PreloadUserModel = require('../models/PreloadUser')

router.post("/api/checkauth", auth(), async (req, res) => {
  if (req.user) {
    const preloadUser = await new PreloadUserModel(req.user)
    res.send(preloadUser)
  } else {
    res.send(false)
  }
})

router.post("/api/checkauth-guest", authGuest(), async (req, res) => {
  res.send(req.user)
})

router.post("/api/login", auth(), async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await new UserService().findUserByUsername(req, email)
    const preloadUser = await new PreloadUserModel(user)
    const passwordHash = await crypto
      .createHash("sha256")
      .update(password)
      .digest("hex")

    if (!user || passwordHash !== user.password) {
      res.status(200).send(false)
      return
    }

    const sessionId = await new SessionService().createSession(req, user._id)
    res.cookie("sessionId", sessionId, { httpOnly: true }).send(preloadUser)
  } catch (err) {
    console.error(err)
  }
})

router.post('/api/registration', auth(), async (req, res) => {
  if (!req.user) {
      const findUser = await new UserService().findUserByUsername(req)
      if (findUser) {
          res.status(200).send(false)
      } else {
          const createUser = await new UserService().createUser(req)
          const preloadUser = await new PreloadUserModel(user)
          if (createUser) {
              const sessionId = await new SessionService().createSession(req, createUser._id)
              res.cookie("sessionId", sessionId, { httpOnly: true }).send(preloadUser)
          } else {
              res.status(200).send(false)
          }
      }
  } else {
      res.status(200).send(false)
  }
})

router.post('/api/registration-guest', authGuest(), async (req, res) => {
  if (!req.user) {
    const createUser = await new UserService().createGuest(req)
    if (createUser) {
        const sessionId = await new SessionService().createSession(req, createUser._id)
        res.cookie("guestSessionId", sessionId, { httpOnly: true }).send(createUser)
    } else {
        res.status(200).send(false)
    }
  } else {
      res.status(200).send(false)
  }
})

router.post("/api/logout", auth(), async (req, res) => {
    if (!req.user) {
      return res.redirect("/")
    }
  
    try {
      await new SessionService().deleteSession(req, req.sessionId)
      res.clearCookie("sessionId").redirect("/")
    } catch (err) {
      console.error(err)
    }
})

router.post('/api/set-socket-id', auth(), async (req, res) => {
  try {
    if (!req.user) {
      res.send(false)
      return
    }
    // await req.db.collection('users').updateOne(
    //   {
    //     _id: ObjectId(req.user._id)
    //   },
    //   {
    //     $push: {
    //       'sockets': req.body.socketId
    //     }
    //   }
    // )
    res.send(true)
  } catch (error) {
    console.error(error)
  }
})

router.post('/api/set-socket-id-guest', authGuest(), async (req, res) => {
  if (!req.user) {
    return
  }
  try {
    await req.db.collection('guests').updateOne(
      {
        _id: ObjectId(req.user._id)
      },
      {
        $set: {
          'socket': req.body.socketId
        }
      }
    )
    res.send(true)
  } catch (error) {
    console.error(error)
  }
})

router.delete('/api/delete-socket-id/:id', auth(), async (req, res) => {
  try {
    const deleteSocketPlace = await req.db.collection('users').updateOne(
      { 'sockets.socketId': req.params.id },
      {'$pull': { "sockets": { "socketId": req.params.id } } }
    )
    const deleteSocketPublic = await req.db.collection('users').updateOne(
      { 'publicSockets': { $in: [req.params.id] } },
      { '$pull': { "publicSockets": req.params.id } }
    )
    if (deleteSocketPlace && deleteSocketPublic) {
      res.send(true)
    } else {
      throw err()
    }
  } catch (error) {
    console.error(error)
  }
})

router.post("/api/check-key", async (req, res) => {
  const user =  await req.db.collection("users").findOne({ restoreCode: +req.body.data.token })
  if (user) {
    res.sendStatus(200)
  } else {
    res.sendStatus(304)
  }
})

router.post("/api/update-password", async (req, res) => {
  const user =  await req.db.collection("users").findOne({ restoreCode: +req.body.data.token })
  if (user) {
    const passwordHash = await crypto
        .createHash('sha256')
        .update(req.body.data.newPassword)
        .digest('hex')

    const setNewPassword = await req.db.collection("users").updateOne(
      { restoreCode: +req.body.data.token, email: req.body.data.email },
      { $set: { password: passwordHash } }
    )

    if (setNewPassword) {
      res.send(true)
    } else {
      res.send(false)
    }

  } else {
    res.send(false)
  }
})

module.exports = router
