# RunEscape

[Link to Live](http://run-escape.herokuapp.com/#/)

## Overview

RunEscape is a infinite running game which the player character(s) have stolen an enchanted charm, a stone of magical power, a "rune" if you will. Now the vault from which they stole the charm seek to reclaim their stolen treasure. Our protagonists must use their 1337 parkouring skills to evade their pursuers. Compete with you friends to get the highest score on the board!

### How to start a game

Before playing, users must make an account on the website, afterwards they are directed to the lobby index. Players must create a lobby in order to play a instance of the game. Other players may also join a lobby so they can play and chat together.

### How to play

Players must avoid obstacles that will end the game if the Player character touches them. You can avoid obstacles by performing the following actions:

* Jump and Double-Jump - SPACEBAR Key
* Slide - DOWN ARROW Key
* Dash - RIGHT ARROW Key on the ground or in the air

Prepare for the dangers ahead.
![](https://i.imgur.com/bwxmPh1.gif)

Staying on the ground too long can be perilous...
![](https://i.imgur.com/xb9L5Td.gif)

But sometimes hugging it can save you from certain doom.
![](https://i.imgur.com/sKxc01E.gif)

Perhaps join some friends and face these obstacles together.
![](https://i.imgur.com/wSBBHFd.gif)

## Technologies Used

RunEscape is composed of a single fullstack application utilizing the MERN stack. The website handles all interactions and displaying of the game.

#### Backend: mongoDB, Express, Node.js, socket.io

RunEscape's backend API allows user authentication, saving/retrieving scoreboards, and creation of lobbies. The backend also stores lobbies created and the users in each lobby. Socket.io is used to allow for real-time interaction and live chat between players in each lobby.

#### Frontend: React, Redux

RunEscape's frontend serves the splash/login page, lobbies, and the highscore board. The game will be contained in a canvas component that's rendered once the user has navigated to a lobby page. The canvas is responsible for rendering all game assets and animations. The page will have keyboard event handlers that send user inputs to the backend, so the backend can serve this input to other users in the same game lobby. Game logic is handled on the player's machine. The lobby page also has a chat component that users may type and send messages to other players that are in the same lobby

## Implementation Details

#### Entities and Game Components

Game entity are created as an object in JavaScript class. Objects have their own properties to determine object dimension, animation definition, action function, update and draw methods to defines how different objects should be render in canvas, etc. During each frame iteration, update and/or draw method will be executed in order to update object position in canvas. Objects are  stored in an array for keeping track of what should be render in canvas.

```javascript

class Player {
  constructor(canvas, context, playerId) {
    this.ctx = context;
    this.cvs = canvas;
    this.playerId = playerId;
    this.fg = {
      h: 59
    }

    this.x = 100;
    this.y = 388;
    this.gravity = 0.25;
    this.jump = 5.6;
    this.speed = 0;
    this.jumpCount = 0;

...
```

```javascript
 lobby.players.map(playerId => 
      state.entities.push(new Player(cvs, ctx, playerId)))
    state.entities.push(new Skeleton(cvs, ctx));
```


### Websockets and Multiplayer

We had some trouble figuring out how to handle multiplayer with an arbitrary number of players, until we realized we can interpolate websocket events dynamically. By interpolating an event with a lobby id, we can fine tune where we send and receive information. Essentially the player event loop looks like this:

1. Player attempts to execute an action and emits a payload
2. Server receives payload and emits to the lobby it originated from
3. All Players in that lobby receive the action
4. The entity owned by the player who originated the action executes the action

#### Socket Implementation

When a user visits a lobby page, the components will mount some sockets to listen to chat and controls. When a player executes a player action, the socket will emit to the server a general player action,`"relay action"`, with the payload of:

```javascript
{ lobbyId: state.lobbyId,
  playerId: state.localPlayerId,
  playerAction: "hop" }
```

Here's an example of this being used when a player attempts to jump using the Spacebar key:

```javascript
// game.jsx

document.addEventListener('keydown', (e) => {
  if (e.keyCode === 32) { //SPACEBAR
    switch (state.current) {
      //...
      case state.game:
        if (this.getCurrentPlayer(state).jumpCount > 0) {
          this.socket.emit("relay action", {
            lobbyId: state.lobbyId,
            playerId: state.localPlayerId,
            playerAction: "hop"
          })
        }
        break;
      //...
```

This emit will be received by the server which is listening for `"relay action"`. By using the payload and interpolating `lobbyId`, we can emit another event back to only that lobby:

```javascript
// app.jsx

socket.on('relay action', ({ lobbyId, playerId, playerAction }) => {
  console.log(`Relay: ${playerId} on ${lobbyId} did ${playerAction}`)
  io.emit(`relay action to ${lobbyId}`, { playerId, playerAction });
})
```

All players in each lobby are subscribed to `"relay action to ${lobbyId}"`, through the following method which is called once: 

```javascript
// game.jsx
subscribeToPlayerActions(state) {
  this.socket.on(`relay action to ${this.lobbyId}`, 
    ({ playerId, playerAction}) => {
      let players = state.entities.filter(entity => 
        entity instanceof Player);
      let player = players.filter(player => 
        playerId === player.playerId)[0];
      switch(playerAction) {
        case "hop":
          player.hop();
          break;
        case "slide":
          player.slide();
          break;
        case "joinLobby":
          this.props.fetchLobby(this.lobbyId);
          this.addPlayerstoLobby(state);
          this.setState({});
          break;
        default:
          break;
      }
    })
```

Essentially this code searches for the player entity with id of `playerId` and executes the corresponding action `playerAction` for that player entity. This way players can send actions which will affect only their player entity for all players in the lobby.

And with that, all players can see every other player's actions!


## Future Implementation

##### More player actions

