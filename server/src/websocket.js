const config = require('./config/config')

const axios = require("axios")

let ioCopy = null

module.exports = {
  start: async(io) => {
    ioCopy = io
    io.sockets.on('connection', (socket) => {
      io.to(socket.id).emit('updateSocketId', socket.id);
      socket.on('disconnect', async () => {
        try {
          await axios({
            method: 'delete',
            url: `${config.ORIGIN}/${socket.id}`
          })
        } catch (error) {
          console.error(error)
        }
      });
    });
  },
  makeOrder: async (data) => {
    data.sockets.forEach(id => {
      ioCopy.to(id).emit('newOrder', data);
    });
  },
  acceptOrder: async (data) => {
    ioCopy.to(data.socket).emit('acceptOrder', data.orderId)
  },
  acceptOrderAdmin: async (data) => {
    for (let i in data.sockets) {
      ioCopy.to(data.sockets[i]).emit('acceptOrderAdmin', data)
    }
  },
  acceptOrderTelegram: async (data) => {
    try {
      await axios({
        method: 'post',
        url: 'http://localhost:8000/api/accept-order',
        data: {
          order: {
            guestId: data.guestId,
            orderId: data.orderId,
            sockets: data.sockets
          },
          telegram: true
        }
      })
      return true
    } catch (error) {
      console.error(error)
    }
  }
}
