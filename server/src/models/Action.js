const { nanoid } = require('nanoid')

const ActionItem = class ActionItem {
    constructor(data) {
        this._id = data._id || nanoid(),
        this.callText = data.callText,
        this.notifyText = data.notifyText,
        this.buttonText = data.buttonText
    }
  }
  
  module.exports = ActionItem
  