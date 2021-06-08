const getRandomString = () => {
  let text = ""
  const charset = "abcdefghijklmnopqrstuvwxyz"
  for (var i = 0; i < 8; i++) {
      text += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return text
}

const Category = class Category {
  constructor(data) {
    this._id = getRandomString(),
    this.name = data
  }
}

module.exports = Category
