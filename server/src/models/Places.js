const Places = class Places {
    constructor(data) {
        this._id = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6),
        this.name = data.name,
        this.phone = data.phone,

        this.website = data.website,
        this.address = data.address,
        this.times = data.times,

        this.telegram = data.telegram,
        this.vk = data.vk,
        this.instagram = data.instagram,
        this.whatsapp = data.whatsapp,
        
        this.tables = [],
        this.link = data.link
    }
  }
  
  module.exports = Places
  