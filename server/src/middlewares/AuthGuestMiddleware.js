const UserService = require('../services/UserService')

const auth = () => async (req, res, next) => {
  if (!req.cookies.guestSessionId) {
    return next()
  }

  try {
    const user = await new UserService().findGuestBySessionId(
      req,
      req.cookies.guestSessionId
    )

    req.user = user
    req.guestSessionId = req.cookies.guestSessionId
    next()
  } catch (err) {
    console.error(err)
  }
}

module.exports = auth
