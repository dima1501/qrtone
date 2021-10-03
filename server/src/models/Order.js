const { nanoid } = require('nanoid')
const { ObjectId } = require('mongodb').ObjectID

const Order = class Order {
  constructor(id, data, place) {
    this.orderId = ObjectId(nanoid()),
    this.goods = data.goods,
    this.dops = data.dops,
    this.guestId = id,
    this.status = data.status,
    this.table = data.table,
    this.place = place,
    this.timestamp = Date.now(),
    this.price = data.price
  }
}

module.exports = Order
