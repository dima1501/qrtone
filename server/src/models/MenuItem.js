const { nanoid } = require('nanoid')

const MenuItem = class MenuItem {
    constructor(data) {
        this._id = nanoid(),
        this.name = data.name,
        this.price = data.price,
        this.image = data.image,
        this.category = data.category,
        this.places = data.places,
        this.count = 0
    }
  }
  
  module.exports = MenuItem
  