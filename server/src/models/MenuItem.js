const { nanoid } = require('nanoid')

const MenuItem = class MenuItem {
    constructor(data) {
        this._id = data._id || nanoid(),
        this.name = data.name,
        this.prices = data.prices,
        this.weights = data.weights,
        this.modifications = data.modifications,
        this.images = data.images,
        this.category = data.category,
        this.places = data.places,
        this.dops = data.dops,
        this.count = 0,
        this.order = data.order ? data.order : 1000,
        this.cartPrices = [],
        this.translation = data.translation,
        this.description = data.description,
        this.calories = data.calories,
        this.fats = data.fats,
        this.proteins = data.proteins,
        this.carbo = data.carbo,
        this.isVegan = data.isVegan
    }
  }
  
  module.exports = MenuItem
  