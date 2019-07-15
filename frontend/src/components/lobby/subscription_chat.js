
import openSocket from 'socket.io-client';
let socket = openSocket('http://localhost:3000');

export const subscribeToChat = (lobbyId) => {
  socket.on(`chat message on ${lobbyId}` , function (msg) {
    document.getElementById('#messages').append('<div>').text(msg)
  });
}

export const sendChatMsg = (lobbyId, msg) => {
  socket.emit("chat message", { lobbyId: lobbyId, msg: msg })
}