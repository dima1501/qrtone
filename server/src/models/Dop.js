const { nanoid } = require('nanoid')

const Dop = class Dop {
  constructor(data) {
    this._id = nanoid(),
    this.name = data.name,
    this.price = data.price,
    this.count = 0,
    this.cartPrices = [],
    this.prices = [data.price]
  }
}

module.exports = Dop
