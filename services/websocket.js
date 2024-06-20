
const socketNew = (socket) => {
    socket.on('new-group-message', (groupId,lastChatId)=> {
        console.log('inSocket',groupId,lastChatId,'groupId,lastChatId')
            socket.broadcast.emit('group-message',groupId,lastChatId);
    })
  }

  module.exports = socketNew