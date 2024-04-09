
const socketNew = (socket) => {
    socket.on('new-common-message', ()=> {
            socket.broadcast.emit('common-message',"new common message recieved");
    })
    socket.on('new-group-message', (groupId,lastChatId)=> {
        console.log('inSocket',groupId,lastChatId,'groupId,lastChatId')
            socket.broadcast.emit('group-message',groupId,lastChatId);
    })
  }

  module.exports = socketNew