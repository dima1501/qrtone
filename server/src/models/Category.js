const Category = class Category {
  constructor(data) {
    this._id = Math.random().toString(36).substring(7),
    this.name = data
  }
}

module.exports = Category
