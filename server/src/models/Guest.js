const { nanoid } = require('nanoid')

const Guest = class Guest {
  constructor(data) {
    this.orders = [],
    this.cart = []
  }
}

module.exports = Guest
