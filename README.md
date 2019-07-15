# RunEscape

2D Multiplayer endless runner game. 

### Background and Overview

RunEscape is a infinite running game which the player character(s) have stolen an enchanted charm, a stone of magical power, a "rune" if you will. Now the vault from which they stole the charm seek to reclaim their stolen treasure. Our protagonists must use their 1337 parkouring skills to evade their pursuers.  

RunEscape will be a web application that has lobby functionality to allow multiple players to escape together. 

### Functionality and MVP
* User authorization: sign up and login
* Displays a leaderboard of highest scores
* Multiplayer
* Procedurally generated stages using deterministic seeding
* Obstacles
* Saving of a user's runs and ability to replay them
* Powerups that affect gameplay
* Production README
#### Bonus feature
* Offensive powerups
* Particles and graphics/Animations

### Technologies and Technical Challenges
RunEscape is a fullstack application utilizing mongoDB, express, and node.js for the backend. It uses react with redux for the frontend framework in order to store current user information, scoreboards, and local game state.

#### Backend: mongoDB, Express, Node.js, socket.io

RunEscape's backend API allows user authentication, saving and retrieving scoreboard and replay information. RunEscape makes heavy use of the socket.io library to get user input in real-time, which is crucial to provide an authentic multiplayer experience. 

#### Frontend: React, Redux

RunEscape's frontend serves the splash/login page, lobbies, and the highscore board. The game will be contained in a canvas component that's rendered once the game is started. The canvas is responsible for rendering all game assets and animations. The page will have keyboard event handlers that send user inputs to the backend, so the backend can serve this input to other users in the same game lobby. Game logic is handled on the player's machine.

#### Technical challenges:
* Using websockets to synchonize game state to all players
* Using canvas to render gameplay

### Things Accomplished Over the Weekend
* Proposal README
* All members read MERN stack module readings
* Skeleton Backend
* User Authentication
* Research on Websockets
* Research on Canvas rendering / Game logic 

### Group Members and Work Breakdown
* Calvin Nguyen - Websockets, Game logic
* Onyi Cho - Websockets, Routing, Backend game logic, React Component and Redux states
* Ken Ha - User Models and Auth, Websockets
* Jimmy Nguyen - Canvas, Websockets, Game logic

#### July 13 & 14, Saturday and Sunday
* Completed MERN stack readings - All
* Preliminary research on Canvas and websockets and game logic - All
* Skeleton - All
* Basic Websocket, Create Lobby, and Lobby chat implementations - Calvin
* Start implementing Scoreboard - Onyi
* User Authentification - Ken

#### July 15, Monday
* Canvas render assets - Ken, Jimmy
* Continue to work on Lobby - Calvin
* Continue to work on Scoreboard - Onyi
* Game logic with frontend React state - All

#### July 16, Tuesday
* Styling game objects on canvas - Ken, Jimmy
* Game logic to store replay - Calvin, Onyi

#### July 17, Wednesday
* Production README completed
