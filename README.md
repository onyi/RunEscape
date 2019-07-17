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

## Technologies Used

RunEscape is composed of a single fullstack application utilizing the MERN stack. The website handles all interactions and displaying of the game.

#### Backend: mongoDB, Express, Node.js, socket.io

RunEscape's backend API allows user authentication, saving/retrieving scoreboards, and creation of lobbies. The backend also stores lobbies created and the users in each lobby. Socket.io is used to allow for real-time interaction and live chat between players in each lobby.

#### Frontend: React, Redux

RunEscape's frontend serves the splash/login page, lobbies, and the highscore board. The game will be contained in a canvas component that's rendered once the user has navigated to a lobby page. The canvas is responsible for rendering all game assets and animations. The page will have keyboard event handlers that send user inputs to the backend, so the backend can serve this input to other users in the same game lobby. Game logic is handled on the player's machine. The lobby page also has a chat component that users may type and send messages to other players that are in the same lobby

## Implementation Details

#### Entities and Game Components

Game entity are created as an object in JavaScript class. Objects have their own properties to determine object dimension, animation definition, action function, update and draw methods to defines how different objects should be render in canvas, etc. During each frame iteration, update and/or draw method will be executed in order to update object position in canvas. Objects are  stored in an array for keeping track of what should be render in canvas.
