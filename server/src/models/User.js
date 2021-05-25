const { nanoid } = require('nanoid')
const moment = require('moment')

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
        _id: 'salads',
        name: 'Салаты'
      },
      {
        _id: 'snacks',
        name: 'Закуски'
      },
      {
        _id: 'soups',
        name: 'Супы'
      },
      {
        _id: 'pizza',
        name: 'Пицца'
      },
      {
        _id: 'hot',
        name: 'Горячие блюда'
      },
      {
        _id: 'side-dishes',
        name: 'Гарниры'
      },
      {
        _id: 'child',
        name: 'Детское меню'
      },
      {
        _id: 'desert',
        name: 'Десерты'
      },
      {
        _id: 'non-alco',
        name: 'Безалкогольные напитки'
      },
      {
        _id: 'alco',
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
    this.dops = [],
    this.notifications = [],
    this.sockets = [],
    this.subscription = [
      {
        type: 'free',
        started: moment()._d,
        expires: moment().add(14, 'days')._d
      }
    ]
  }
}

module.exports = User
