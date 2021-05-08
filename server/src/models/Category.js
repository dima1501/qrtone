const { nanoid } = require('nanoid')

const Category = class Category {
  constructor(data) {
    this._id = nanoid(),
    this.name = data
  }
}

module.exports = Category
