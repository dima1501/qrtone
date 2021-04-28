const { nanoid } = require('nanoid')

const User = class User {
  constructor(name, password, email) {
    this.name = name,
    this.password = password,
    this.email = email,
    this.goods = [],
    this.orders = [],
    this.bot_token = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6),
    this.places = [],
    this.photo = null,
    this.background = null,
    this.categories = [
      'Салаты',
      'Закуски',
      'Супы',
      'Пицца',
      'Горячие блюда',
      'Гарниры',
      'Детское меню',
      'Десерты',
      'Безалкогольные напитки',
      'Алкогольные напитки',
    ],
    this.telegram = {}
  }
}

module.exports = User
