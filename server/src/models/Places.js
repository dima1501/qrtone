
const Places = class Places {
    constructor(data) {
        this._id = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6),
        this.name = data.name,
        this.phone = data.phone,
        this.inst = data.inst,
        this.vk = data.vk,
        this.wa = data.wa,
        this.tables = [],
        this.link = data.link
    }
  }
  
  module.exports = Places
  