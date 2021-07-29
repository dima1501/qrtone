const { ObjectId } = require('mongodb')

const PreloadUser = class PreloadUser {
  constructor(data) {
    this._id = ObjectId(data._id),
    this.name = data.name,
    this.description = data.description,
    this.bot_token = data.bot_token,
    this.photo = data.photo,
    this.background = data.background,
    this.places = data.places,
    this.categories = data.categories,
    this.telegram = data.telegram,
    this.actions = data.actions,
    this.goods = data.goods,
    this.dops = data.dops,
    this.orders = [],
    this.messages = [],
    this.notifications = [],
    this.sockets = [],
    this.subscription = data.subscription,
    this.currencySymbol = data.currencySymbol,
    this.fastActionsEnabled = data.fastActionsEnabled,
    this.isOnboardCompleted = data.isOnboardCompleted,
    this.waiters = data.waiters
  }
}

module.exports = PreloadUser
