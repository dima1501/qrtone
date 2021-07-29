const { nanoid } = require('nanoid')

const Waiter = class Waiter {
  constructor(data) {
    this._id = data._id ? data._id : nanoid(),
    this.name = data.name,
    this.id = data.id,
    this.photo = data.photo,
    this.places = data.places
  }
}

module.exports = Waiter
