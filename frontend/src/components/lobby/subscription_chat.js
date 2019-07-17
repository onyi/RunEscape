
import openSocket from 'socket.io-client';
let HOST = location.origin.replace(/^http/, 'ws')
let socket = openSocket(HOST);

export const subscribeToChat = (lobbyId) => {
  socket.on(`chat message on ${lobbyId}` , function (msg) {
    document.getElementById('#messages').append('<div>').text(msg)
  });
}

export const sendChatMsg = (lobbyId, msg) => {
  socket.emit("chat message", { lobbyId: lobbyId, msg: msg })
}