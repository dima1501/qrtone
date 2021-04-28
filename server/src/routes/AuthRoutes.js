const express = require('express')
const router = express.Router()

const { ObjectId } = require('mongodb').ObjectID

const websocket = require('../websocket')

const auth = require('../middlewares/AuthMiddleware')
const authGuest = require('../middlewares/AuthGuestMiddleware')

const UserService = require('../services/UserService')
const SessionService = require('../services/SessionService')

const crypto = require('crypto')

router.post("/api/checkauth", auth(), async (req, res) => {
    res.send(req.user);
});

router.post("/api/checkauth-guest", authGuest(), async (req, res) => {
  res.send(req.user);
});

router.post("/api/login", auth(), async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await new UserService().findUserByUsername(req, email);
        const passwordHash = await crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");
  
        if (!user || passwordHash !== user.password) {
          return;
        }
  
        const sessionId = await new SessionService().createSession(req, user._id);
        res.cookie("sessionId", sessionId, { httpOnly: true }).send(user);
      } catch (err) {
        console.error(err);
      }
    }
);

router.post('/api/registration', auth(), async (req, res) => {
  if (!req.user) {
      const findUser = await new UserService().findUserByUsername(req)
      if (findUser) {
          res.status(200).send(false)
      } else {
          const createUser = await new UserService().createUser(req)
          if (createUser) {
              const sessionId = await new SessionService().createSession(req, createUser._id);
              res.cookie("sessionId", sessionId, { httpOnly: true }).send(createUser);
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
        const sessionId = await new SessionService().createSession(req, createUser._id);
        res.cookie("guestSessionId", sessionId, { httpOnly: true }).send(createUser);
    } else {
        res.status(200).send(false)
    }
  } else {
      res.status(200).send(false)
  }
})

router.get("/api/logout", auth(), async (req, res) => {
    if (!req.user) {
      return res.redirect("/");
    }
  
    try {
      await new SessionService().deleteSession(req, req.sessionId);
      res.clearCookie("sessionId").redirect("/");
    } catch (err) {
      console.error(err);
    }
})

router.post('/api/set-socket-id', auth(), async (req, res) => {
  try {
    if (!req.user) {
      res.send(false)
      return
    }
    await req.db.collection('users').updateOne(
      {
        _id: ObjectId(req.user._id)
      },
      {
        $push: {
          'sockets': req.body.socketId
        }
      }
    )
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
    await req.db.collection('users').updateOne(
      {
        'sockets': { $in: [req.params.id] }
      },
      {
        $pull: {
          'sockets': req.params.id
        }
      }
    )
    res.send(true)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
