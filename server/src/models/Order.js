const { nanoid } = require('nanoid')

const Guest = class Guest {
  constructor(id, data) {
    this.orderId = nanoid(),
    this.goods = data.goods,
    this.guestId = id,
    this.status = data.status,
    this.table = data.table,
    this.place = data.place,
    this.timestamp = Date.now()
  }
}

module.exports = Guest
