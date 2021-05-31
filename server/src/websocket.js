const config = require('./config/config')

const axios = require("axios")
const e = require('express')

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
            url: `${config.API_SERVER}/api/delete-socket-id/${socket.id}`
          })
        } catch (error) {
          console.error(error)
        }
      });
    });
  },
  makeOrder: async (data) => {
    data.sockets.forEach(e => {
      ioCopy.to(e.socketId).emit('newOrder', data);
    });
  },
  acceptOrder: async (data) => {
    ioCopy.to(data.socket).emit('acceptOrder', data.orderId)
  },
  acceptOrderAdmin: async (data) => {
    for (let i in data.sockets) {
      ioCopy.to(data.sockets[i].socketId).emit('acceptOrderAdmin', data)
    }
  },
  acceptOrderTelegram: async (data) => {
    try {
      await axios({
        method: 'post',
        url: `${config.API_SERVER}/api/accept-order`,
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
  },
  fastAction: async (data) => {
    console.log('fast-action')
    try {
      data.sockets.forEach(e => {
        ioCopy.to(e.socketId).emit('newFastAction', data.data);
      });
    } catch (error) {
      console.error(error)
    }
  },
  acceptFastAction: async (data) => {
    data.sockets.forEach(e => {
      ioCopy.to(e.socketId).emit('acceptFastAction', data.data);
    });
  },
  acceptFastActionTelegram: async (data) => {
    try {
      await axios({
        method: 'post',
        url: `${config.API_SERVER}/api/accept-fast-action-tg`,
        data: {
          _id: data.data._id
        }
      })
      data.sockets.forEach(e => {
        ioCopy.to(e.socketId).emit('acceptFastAction', data.data);
      });
      return true
    } catch (error) {
      console.error(error)
    }
  },
  newTGUser: async (data) => {
    console.log(data)
    data.sockets.forEach(e => {
      ioCopy.to(e).emit('newTGUser');
    });
  }
}
