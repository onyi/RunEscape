
import React from 'react';
import Prando from 'prando';
import openSocket from 'socket.io-client';

import Player from './Player';
import Skeleton from './Skeleton';

import Background from './Background';
import Foreground from './Foreground';

import GameOver from './GameOver';
import GetReady from './GetReady';

import Dragon from './Dragon';

import ControlPrompt from './ControlPrompt'

import suddenatksound from '../../assets/game/lunatic_eyes.mp3';
import pointSound from '../../assets/game/sfx_point.wav';

import Score from './Score';

const GAME_STATE = require('./GameState');

const KEY = {
  SPACE: 32,
  RIGHT: 39,
  DOWN: 40,
}

const BASE_DX = 8;

class Game extends React.Component {
  constructor(props){
    super(props);

    this.game = {
      gameState: GAME_STATE.INIT,
      localPlayerId: props.currentUser.id,
      isOver: false,
      scores: props.scores,
      dx: BASE_DX,
      entities: [],
      players: [],
      isAlive: true,
      isHost: false,
    }

    // this.rng = new Prando(props.lobbyId);
    // console.log(`${Date.now()}`)
    this.rng = new Prando(Date.now());
    this.game.scores = props.scores;
    this.lobbyId = props.lobbyId;
    this.frame = 0;
    
    this.keyDown = {
      [KEY.SPACE]: false,
      [KEY.RIGHT]: false,
      [KEY.DOWN]: false,
    }

    this.gameplay_music = new Audio();
    this.gameplay_music.src = suddenatksound;

    this.point_sound = new Audio();
    this.point_sound.src = pointSound;

    this.gameSpoint_soundtate = {
      current: 0,
      getReady: 0,
      game: 1,
      over: 2,
    }
    
    this.loop = this.loop.bind(this);
    this.draw = this.draw.bind(this);
    this.update = this.update.bind(this);
    this.generateSkeletons = this.generateSkeletons.bind(this);
    this.removeSkeleton = this.removeSkeleton.bind(this);
    this.removeDragons = this.removeDragons.bind(this);
    this.removeSkeletons = this.removeSkeletons.bind(this);
    this.gameOverAction = this.gameOverAction.bind(this);
    this.addPlayerstoLobby = this.addPlayerstoLobby.bind(this);
    this.getCurrentPlayer = this.getCurrentPlayer.bind(this);
    this.subscribeToPlayerActions = this.subscribeToPlayerActions.bind(this);
    this.increaseSpeed = this.increaseSpeed.bind(this);
    this.localGameOverAction = this.localGameOverAction.bind(this);
    this.sendHeartbeat = this.sendHeartbeat.bind(this);
    this.subscribeToGameState = this.subscribeToGameState.bind(this);
    this.subscribeToHeartbeat = this.subscribeToHeartbeat.bind(this);
  }
  
  componentDidMount() {
    this.cvs = this.refs.canvas;
    this.ctx = this.cvs.getContext("2d");
    this.ctx.font = "30px Silver";

    this.gameScore = new Score(this.cvs, this.ctx);
    this.bg = new Background(this.cvs, this.ctx);
    this.fg = new Foreground(this.cvs, this.ctx);
    this.getReady = new GetReady(this.cvs, this.ctx);
    this.gameOver = new GameOver(this.cvs, this.ctx);
    this.controlPrompt = new ControlPrompt(this.cvs, this.ctx);    
    
    this.socket = openSocket(window.location.origin);

    this.props.getScores();
    // console.log(`Component mounted, Add player to lobby`)
    this.addPlayertoLobby(this.game.localPlayerId);
    this.props.fetchLobby(this.lobbyId)
      .then(payload => {
        this.lobby = payload.lobby;
        this.addPlayerstoLobby(payload.lobby);
        // console.log(`HostPlayerId: ${this.lobby.hostPlayerId}; localPlayerId: ${this.game.localPlayerId}; this.lobby.hostPlayerId === this.localPlayerId: ${this.lobby.hostPlayerId === this.game.localPlayerId}`)
        this.game.isHost = Boolean(this.lobby.hostPlayerId === this.game.localPlayerId)
      })
      .then(() => this.mountController())
      .then(() => this.subscribeToPlayerActions())
      .then(() => this.subscribeToGameState());

    this.loop();
  }

  componentWillUnmount() {
    console.log("Game has unmounted");
    this.socket.emit("chat message", { lobbyId: this.lobbyId, msg: "d/c"});
    this.socket.off(`relay action to ${this.lobbyId}`);
    this.socket.off(`relay game state to ${this.lobbyId}`); 
    this.socket.close();
    // this.socket.disconnect(true);

    this.game.gameState = GAME_STATE.DISCONNECTED;
    this.gameplay_music.pause();
    this.gameOver.gameover_music.pause();
  }

  componentDidUpdate() {
    window.onpopstate = (e) => {
      // window.location.reload();
    }
  }

  initialize() {
    this.game.gameState = GAME_STATE.READY;
  }

  startGame(randomNum) {
    this.rng = new Prando(randomNum ? randomNum : this.lobbyId);
    this.game.entities = [];
    this.game.entities.push(new Skeleton(this.cvs, this.ctx));

    this.frame = 0;
    this.gameplay_music.currentTime = 0;
    this.gameOver.gameover_music.currentTime = 0;
    this.gameplay_music.play();
    this.gameScore.reset();

    this.game.players.forEach(
      player => player.currentAnimation = player.runningAnimation);

    this.game.gameState = GAME_STATE.RUNNING;
    this.game.dx = BASE_DX;

    this.game.isOver = false;

  }

  restartGame() {
    if (this.game.isHost){
      this.socket.emit("relay game state", {
        lobbyId: this.props.lobbyId,
        playerId: this.game.localPlayerId,
        gameState: "restart"
      });
    }
    // console.log(`Restarting game`)
    this.addPlayertoLobby(this.game.localPlayerId);
    
    this.game.entities = [];
    this.gameOver.gameover_music.pause();

    this.game.players.forEach(
      player => {
        player.currentAnimation = player.idleAnimation
        player.alive = true;
      });
      
    this.game.gameState = GAME_STATE.READY;

    this.bg.reset();
    this.fg.reset();

    this.game.isOver = false;
  }

  localGameOverAction(){
    if (!this.game.isOver){
      this.game.isOver = true;
      this.socket.emit(`relay game state`, {
        lobbyId: this.lobbyId,
        playerId: this.game.localPlayerId,
        gameState: "playerDied"
      });
    }
  }

  gameOverAction() {
    this.gameplay_music.pause();
    this.gameOver.gameover_music.play();

    this.socket.emit("chat message", {
      lobbyId: this.props.lobbyId,
      msg: `${this.props.currentUser.username} met their end`
    });


    this.game.isOver = true;
    this.game.gameState = GAME_STATE.OVER;

    this.props.postScore(this.gameScore.score);

    if (this.game.isHost) {
      // console.log(`Game should end by host`)
      this.socket.emit(`relay game state`, {
        lobbyId: this.lobbyId,
        playerId: this.game.localPlayerId,
        gameState: "gameover"
      });
    }

    // this.bg.reset();
    // this.fg.reset();
  }

  // bind controls for the local player, must be called after local player exists
  mountController() {
    document.addEventListener('keydown', (e) => {

      let player = this.getCurrentPlayer();
      let key = e.keyCode;
      
      if (Object.values(KEY).includes(key)) {
        e.preventDefault();  // prevent default scrolling for actions
        switch (this.game.gameState) {
          case GAME_STATE.INIT:
            break;
          case GAME_STATE.READY:
            if (this.game.localPlayerId === this.lobby.hostPlayerId) {
              let newRandom = Date.now();
              this.socket.emit(`relay game state`, {
                lobbyId: this.lobbyId,
                playerId: this.game.localPlayerId,
                gameState: "startGame",
                randomNum: newRandom
              })
              this.startGame(newRandom);
            }
            break;
          case GAME_STATE.RUNNING:
            if (key === KEY.SPACE && !this.keyDown[KEY.SPACE]) {
              player.hop();
              this.socket.emit("relay action", {
                lobbyId: this.lobbyId,
                playerId: this.game.localPlayerId,
                playerAction: "hop"
              })
            }

            if (key === KEY.DOWN &&
              !this.keyDown[KEY.DOWN] &&
              !player.isGrounded()) {
              player.fastfall();
              this.socket.emit("relay action", {
                lobbyId: this.lobbyId,
                playerId: this.game.localPlayerId,
                playerAction: "fastfall"
              })
            }

            if (key === KEY.RIGHT &&
              !this.keyDown[KEY.RIGHT] &&
              player.airDashCount > 0) {
              // Disable airdash when there is more than 1 player
              if(this.game.players.length > 1) return;
              player.airdash();
              this.socket.emit("relay action", {
                lobbyId: this.lobbyId,
                playerId: this.game.localPlayerId,
                playerAction: "airdash"
              });
              this.game.dx = this.game.dx + 6;
            }
            break;
          case GAME_STATE.OVER:
            this.restartGame();
            break;
          default:
            break;
        }

        this.keyDown[key] = true;

      }
      
    })

    document.addEventListener('keyup', (e) => {
      // e.preventDefault();  // prevent default scrolling for actions
      // let player = this.getCurrentPlayer();
      let key = e.keyCode;

      if (!Object.values(KEY).includes(key)) return;
      this.keyDown[key] = false;
    })
  }

  // Subscribe socket to player action relay
  subscribeToPlayerActions() {
    this.socket.on(`relay action to ${this.lobbyId}`,
      ({ playerId, playerAction }) => {

        let player = this.game.players.filter(player => player.playerId === playerId)[0];
        // do not subscribe to the local player
        if (player === this.getCurrentPlayer()) return;

        //Reserved for future implementation based on game stae
        switch (this.game.gameState) {
          case "GET_READY":
            break;
          case "RUNNING":
            break;
          case "GAME_OVER":
            break;
          default:
            break;
        }

        if (playerAction === "joinLobby") {
          this.addPlayertoLobby(playerId);
        }

        if (player) {
          switch (playerAction) {
            case "leaveLobby":
              this.removePlayerFromLobby(playerId);
              break;
            case "hop":
              player.hop();
              break;
            case "slide":
              player.slide();
              break;
            case "unslide":
              player.unslide();
              break;
            case "fastfall":
              player.fastfall();
              break;
            case "airdash":
              player.airdash();
              break;
            default:
              break;
          }
        }
      });

  } 

  subscribeToGameState(){
    this.socket.on(`relay game state to ${this.lobbyId}`,
      ({ playerId, gameState, randomNum }) => {
        //Change game running state

        let player = this.game.players.filter(player => player.playerId === playerId)[0];
        // do not subscribe to the local player
        if (player === this.getCurrentPlayer()) return;

        if (gameState === "startGame") {
          this.startGame(randomNum);
        }
        else if (gameState === "playerDied") {
          if(player)
            player.alive = false;
        }
        else if (gameState === "gameover") {
          console.log(`Game Over`);
          this.gameOverAction();
        }
        else if (gameState === "restart") {
          console.log(`Time to restart the game by host`);
          this.restartGame();
        }
    });

  }

  subscribeToHeartbeat(){
    this.socket.on(`relay heartbeat to ${this.lobbyId}`, 
      ({ playerId, gameState }) => {
        this.addPlayertoLobby(playerId);
        this.game.gameState = gameState;
      })
  }

  sendHeartbeat(){
    if(this.frame % 300 === 0){
      this.socket.emit(`relay heartbeat`, {
        lobbyId: this.lobbyId,
        playerId: this.game.localPlayerId,
        gameState: this.gameState
      });
    }
  }

  // add a single playerId to local game lobby
  addPlayertoLobby(playerId) {
    // console.log(`Add single player to lobby`);
    let playerIds = this.game.players.map(player => player.playerId)
    let players = this.game.players;
    // console.log(`Player ID: ${playerIds}`);
    if (!playerIds.includes(playerId)){
      let newPlayer = new Player(this.cvs, this.ctx, playerId, players.length * 20);
      if(this.game.gameState === GAME_STATE.RUNNING){
        newPlayer.alive = false;
      }
      players.push(newPlayer);
    }
  }

  // add all players to local lobby, from fetch
  addPlayerstoLobby(lobby) {
    // console.log(`Add players from lobby`);
    let playerIds = this.game.players.map(player => player.playerId);

    let players = this.game.players;
    for (let i = 0; i < lobby.players.length; i++) {
      // console.log(`Lobby Player ID: ${lobby.players[i]}`)
      if (lobby.players[i] && !playerIds.includes(lobby.players[i])){
        let newPlayer = new Player(this.cvs, this.ctx, lobby.players[i], 20 + i * 20);
        if (this.game.gameState === GAME_STATE.RUNNING) {
          newPlayer.alive = false;
        }
        players.push(newPlayer);
      }
    }
  }

  // remove playerId from local lobby
  removePlayerFromLobby(playerId) {
    let players = this.game.players;
    let index = players.indexOf(playerId);
    players.splice(index, 1);
  }

  // returns the local player entity 
  getCurrentPlayer() {
    return this.game.players.filter(entity =>
      entity instanceof Player && entity.playerId === this.props.currentUser.id)[0];
  }

  generateSkeletons() {
    if (this.frame % (50 + (Math.floor(this.rng.next() * 25))) === 0 && this.game.gameState === GAME_STATE.RUNNING) {
      this.game.entities.push(new Skeleton(this.cvs, this.ctx));
      // console.log(`Push Skeleton`)
    }
  }

  generateEnemies() {
    if (this.frame % (80 + (Math.floor(this.rng.next() * 25))) === 0) {
      let num = Math.floor(this.rng.next() * 100);
      if (num >= 50) {
        this.game.entities.push(new Skeleton(this.cvs, this.ctx));
      } else {
        this.game.entities.push(new Dragon(this.cvs, this.ctx));
      }
    }
  }

  removeSkeleton() {
    for (let i = 0; i < this.game.entities.length; i++) {
      if (this.game.entities[i] instanceof Skeleton) {
        if (this.game.entities[i].x < 0 - this.game.entities[i].w) {
          delete this.game.entities[i];
          i--;
        }
      }
    }
  }

  removeSkeletons() {
    for (let i = 0; i < this.game.entities.length; i++) {
      if (this.game.entities[i] instanceof Skeleton) {
        delete this.game.entities[i];
        i--;
      }
    }

  }

  removeDragon() {
    for (let i = 0; i < this.game.entities.length; i++) {
      if (this.game.entities[i] instanceof Dragon) {
        if (this.game.entities[i].x < 0 - this.game.entities[i].w) {
          delete this.game.entities[i];
          i--;
        }
      }
    }
  }

  removeDragons() {
    for (let i = 0; i < this.game.entities.length; i++) {
      if (this.game.entities[i] instanceof Dragon) {
        delete this.game.entities[i];
        i--;
      }
    }
  }

  increaseSpeed(dx) {
    if(this.game.dx + dx < BASE_DX) {
      this.game.dx = BASE_DX;
    } else {
      this.game.dx = this.game.dx + dx;
    }
  }

  draw() {
    switch (this.game.gameState) {
      case GAME_STATE.INIT:
        break;
      case GAME_STATE.READY:
        break;
      case GAME_STATE.RUNNING:
        break;
      case GAME_STATE.OVER:
        break;
      default:
        break;
    }

    this.ctx.fillStyle = '#866286';
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    this.bg.draw();
    this.fg.draw();
    this.game.entities.forEach(entity => entity.draw(this.game))
    this.game.players.forEach(entity => entity.draw(this.game))
    this.gameScore.draw(this.game);
    this.getReady.draw(this.game);
    this.gameOver.draw(this.game);
    this.controlPrompt.draw(this.game);
  }

  update() {
    this.sendHeartbeat();

    switch (this.game.gameState) {
      case GAME_STATE.INIT:
        this.initialize();
        break;
      case GAME_STATE.READY:
        break;
      case GAME_STATE.RUNNING:
        this.frame++;
        this.removeSkeleton();
        this.removeDragon();

        this.generateEnemies();

        // to improves game speed, do not emit unslide if player is unable
        let player = this.getCurrentPlayer();
        if (this.keyDown[KEY.DOWN] &&
            player.isGrounded() &&
            player.sliding === false) {
          player.slide();
          this.socket.emit("relay action", {
            lobbyId: this.lobbyId,
            playerId: this.game.localPlayerId,
            playerAction: "slide"
          })
        }
        // unslide only if able
        if (!this.keyDown[KEY.DOWN] &&
            this.game.gameState === GAME_STATE.RUNNING &&
            player.sliding === true) {
          player.unslide();
          this.socket.emit("relay action", {
            lobbyId: this.props.lobbyId,
            playerId: this.game.localPlayerId,
            playerAction: "unslide"
          })
        }
        break;
      case GAME_STATE.OVER:
        break;
      default:
        break;
    }

    this.game.players.forEach(entity => {
      entity.update(this.game, this.increaseSpeed);
    });

    this.game.entities.forEach(entity => {
      entity.update(this.game, this.gameScore, this.localGameOverAction);
    })
    this.gameScore.update(this.game);
    this.bg.update(this.game);
    this.fg.update(this.game);



    

    //logic to check player list
    // this.game.players.forEach(player => {
    //   console.log(`Player: ${player.playerId}, Is Alive: ${player.alive}`);
    // })

    // console.log(`Is all game over: ${this.game.players.every(player => !player.alive)}`)
    // console.log(`Game State: ${this.game.gameState}; is over: ${this.game.isOver}`);

    if(this.game.players.every( player => !player.alive) ) {
      if (this.game.gameState === GAME_STATE.RUNNING){
        this.gameOverAction();
      }
    }
  }

  //loop
  loop() {
    if (this.game.gameState === GAME_STATE.DISCONNECTED) return;

    // console.log(`Loop, frame: ${this.frame}`);
    this.update();
    this.draw();
    requestAnimationFrame(this.loop);
  }

  render() {
    return (
      <div tabIndex="0">
        <canvas ref="canvas" id="run-escape" width="800" height="500"></canvas>
      </div>
    );
  }
}

export default Game;