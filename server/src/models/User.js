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
      {
        _id: nanoid(),
        name: 'Салаты'
      },
      {
        _id: nanoid(),
        name: 'Закуски'
      },
      {
        _id: nanoid(),
        name: 'Супы'
      },
      {
        _id: nanoid(),
        name: 'Пицца'
      },
      {
        _id: nanoid(),
        name: 'Горячие блюда'
      },
      {
        _id: nanoid(),
        name: 'Гарниры'
      },
      {
        _id: nanoid(),
        name: 'Детское меню'
      },
      {
        _id: nanoid(),
        name: 'Десерты'
      },
      {
        _id: nanoid(),
        name: 'Безалкогольные напитки'
      },
      {
        _id: nanoid(),
        name: 'Алкогольные напитки'
      }
    ],
    this.telegram = {},
    this.actions = [
      {
        _id: nanoid(),
        callText: 'Позвать официанта',
        notifyText: '🙋🏼‍♂️ Столику №@table нужна ваша помощь!',
        buttonText: '🏃 Уже бегу'
      },
      {
        _id: nanoid(),
        callText: 'Попросить счет',
        notifyText: '🙋🏼‍♂️ Столику №@table нужен счет!',
        buttonText: '🏃 Хорошо'
      }
    ],
    this.dops = []
  }
}

module.exports = User
