const { nanoid } = require('nanoid')

const MenuItem = class MenuItem {
    constructor(data) {
        this._id = data._id || nanoid(),
        this.name = data.name,
        this.prices = data.prices,
        this.weights = data.weights,
        this.images = data.images,
        this.category = data.category,
        this.places = data.places,
        this.dops = data.dops,
        this.count = 0,
        this.order = 0
    }
  }
  
  module.exports = MenuItem
  