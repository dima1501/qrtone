const { nanoid } = require('nanoid')

const ActionItem = class ActionItem {
    constructor(data) {
        this._id = data._id || nanoid(),
        this.callText = data.callText,
        this.notifyText = data.notifyText,
        this.isActive = data.isActive
    }
  }
  
  module.exports = ActionItem
  