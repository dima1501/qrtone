const crypto = require('crypto')
const { ObjectId } = require('mongodb').ObjectID
const GuestModel = require('../models/Guest')
const UserModel = require('../models/User')

class UserService {
  async createUser(req) {
    try {
      const passwordHash = await crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('hex')

      const user = await new UserModel(req.body.name, passwordHash, req.body.email)
      await req.db.collection('users').insertOne(user)

      return user
    } catch (err) {
      console.error(err)
    }
  }

  async createGuest(req) {
    try {
      const guest = await new GuestModel(req)
      await req.db.collection('guests').insertOne(guest)

      return guest
    } catch (err) {
      console.error(err)
    }
  }

  async findUserBySessionId(req, sessionId) {
    try {
      const session = await req.db.collection('sessions').findOne(
        { sessionId },
        {
          projection: { userId: 1 },
        }
      )
      if (!session) {
        return
      }

      return req.db.collection('users').findOne(
        { _id: ObjectId(session.userId) }
      )
    } catch (err) {
      console.error(err)
    }
  }
  
  async findGuestBySessionId(req, sessionId) {
    try {
      const session = await req.db.collection('sessions').findOne(
        { sessionId },
        { projection: { userId: 1 } }
      )
      if (!session) {
        return
      }

      return req.db.collection('guests').findOne(
        { _id: ObjectId(session.userId) })
    } catch (err) {
      console.error(err)
    }
  }

  async findUserByUsername(req) {
    try {
      const user = await req.db.collection('users').findOne({ email: req.body.email })
      if (user) {
        return user
      }
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = UserService
