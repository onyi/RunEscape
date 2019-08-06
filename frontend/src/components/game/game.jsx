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

class Game extends React.Component {

  constructor(props){
    super(props);

    this.game = {
      gameState: 0,
      localPlayerId: this.props.currentUser.id,
      current: 0,
      isOver: false,
      scores: props.scores,
      dx: 8,
      entities: []
    }

    this.gameState = require('./GameState');

    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.loop = this.loop.bind(this);
    this.draw = this.draw.bind(this);
    this.update = this.update.bind(this);
    this.renderGame = this.renderGame.bind(this);
    this.generateSkeletons = this.generateSkeletons.bind(this);
    this.removeSkeleton = this.removeSkeleton.bind(this);
    this.removeDragons = this.removeDragons.bind(this);
    this.removeSkeletons = this.removeSkeletons.bind(this);
    this.gameOverAction = this.gameOverAction.bind(this);
    this.addPlayerstoLobby = this.addPlayerstoLobby.bind(this);
    this.getCurrentPlayer = this.getCurrentPlayer.bind(this);
    this.subscribeToPlayerActions = this.subscribeToPlayerActions.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.increaseSpeed = this.increaseSpeed.bind(this);
    
    this.lobbyId = this.props.lobbyId;
    this.renderGame = this.renderGame.bind(this);
    this.socket = openSocket(window.location.origin);
  }

  componentDidMount() {
    // console.log(`${JSON.stringify(this.props)}`);

    // console.log(`Lobby ID: ${JSON.stringify(this.props.lobbyId)}`);

    this.props.getScores();


    let canvas = this.refs.canvas;
    this.cvs = canvas;
    let context = canvas.getContext("2d");
    this.ctx = context;
    this.ctx.font = "30px Silver";


    let socket = openSocket(window.location.origin);

    this.socket = socket;

    let gameplay_music = new Audio();
    gameplay_music.src = suddenatksound;
    this.gameplay_music = gameplay_music;

    const point_sound = new Audio();
    point_sound.src = pointSound;
    this.point_sound = point_sound;

    this.gameSpoint_soundtate = {
      current: 0,
      getReady: 0,
      game: 1,
      over: 2,
    }
    let rng = new Prando(this.props.lobbyId);
    this.rng = rng;
    let gameScore = new Score(canvas, context);
    this.gameScore = gameScore;

    this.game.scores= this.props.scores;
    this.game.gameState = 0;
    this.game.localPlayerId = this.props.currentUser.id;
    this.game.current = 0;
    this.game.isOver = false;
    
    this.renderGame = this.renderGame.bind(this);
    this.lobbyId = this.props.lobbyId
    this.frame = 0;


    // let cvs = document.getElementById('run-escape');
    // let ctx = cvs.getContext('2d');

    this.bg = new Background(canvas, context);
    this.fg = new Foreground(canvas, context);

    this.getReady = new GetReady(this.cvs, this.ctx);
    this.gameOver = new GameOver(this.cvs, this.ctx);

    this.controlPrompt = new ControlPrompt(this.cvs, this.ctx);

    this.renderGame();
    
  }

  componentWillUnmount() {
    this.socket.off(`relay action to ${this.lobbyId}`);
  }

  onKeyUp(e){
    if (e.keyCode === 40 && this.game.current === this.gameState.game) {
      this.socket.emit("relay action", {
        lobbyId: this.props.lobbyId,
        playerId: this.game.localPlayerId,
        playerAction: "unslide"
      })
    }
  }

  onKeyPressed(e){
    //control the game state
    // console.log(`onKeyPressed`);

    let player = this.game.entities.filter(entity => 
      entity instanceof Player && entity.playerId === this.props.currentUser.id)[0];
    // let player = players.filter(player => this.game.localPlayerId === player.playerId)[0];
    if (e.keyCode === 32 || e.keyCode === 40 || e.keyCode === 39) {
      switch (this.game.current) {
        case this.gameState.getReady:
          this.gameplay_music.currentTime = 0;
          this.gameOver.gameover_music.currentTime = 0;
          this.gameplay_music.play();
          player.currentAnimation = player.runningAnimation;
          this.gameScore.reset();
          this.game.current = this.gameState.game;
          break;
        case this.gameState.game:
          if (e.keyCode === 32) {
            this.socket.emit("relay action", {
              lobbyId: this.lobbyId,
              playerId: this.game.localPlayerId,
              playerAction: "hop"
            })
          } else if (e.keyCode === 40 && player.jumpCount !== 2) {
            this.socket.emit("relay action", {
              lobbyId: this.lobbyId,
              playerId: this.game.localPlayerId,
              playerAction: "fastfall"
            })
          } else if (e.keyCode === 40 && player.jumpCount === 2) {
            this.socket.emit("relay action", {
              lobbyId: this.lobbyId,
              playerId: this.game.localPlayerId,
              playerAction: "slide"
            })
          }

          if (e.keyCode === 39 && player.airDashCount > 0) {
            this.socket.emit("relay action", {
              lobbyId: this.lobbyId,
              playerId: this.game.localPlayerId,
              playerAction: "airdash"
            });
            this.game.dx = this.game.dx += 6
          }
          break;
        case this.gameState.over:
          player.currentAnimation = player.idleAnimation
          this.removeSkeletons();
          this.removeDragons();
          this.gameOver.gameover_music.pause();
          this.gameOverAction();
          this.game.current = this.gameState.getReady;
          break;
      }
    }
  }


  addPlayerstoLobby() {
    // this.props.lobbies[this.lobbyId].players.map(playerId => 
    //   state.this.game.entities.push(new Player(state.cvs, state.ctx, playerId)))

    for (let i = 0; i < this.props.lobbies[this.lobbyId].players.length; i++) {
      this.game.entities.push(new Player(this.cvs, this.ctx, this.props.lobbies[this.lobbyId].players[i], i * 20))
    }

  }

  getCurrentPlayer(state) {
    return this.game.entities.filter(entity =>
      entity instanceof Player && entity.playerId === this.props.currentUser.id);
  }

  // Subscribe socket to player action relay
  subscribeToPlayerActions() {
    this.socket.on(`relay action to ${this.lobbyId}`, 
      ({ playerId, playerAction}) => {
        let players = this.game.entities.filter(entity => 
          entity instanceof Player)
        let player = players.filter(player => 
          playerId === player.playerId)[0];
        if (player){
          switch(playerAction) {
            case "joinLobby":
              this.props.fetchLobby(this.lobbyId);
              this.addPlayerstoLobby();
            case "hop":
              player.sliding = false;
              player.hop();
              break;
            case "slide":
              player.sliding = true;
              player.currentAnimation = player.slidingAnimation;
              break;
            case "unslide":
              player.currentAnimation = player.runningAnimation;
              player.sliding = false;
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

    this.socket.on(`relay game state to ${this.props.lobbyId}`,
      ({ lobbyId, gameState }) => {
        console.log(`receive new game state from lobby ${lobbyId}, game state: ${gameState}`);
        switch(gameState){
          case 2:
            console.log(`Game over son`);
          case 1:
            console.log(`playing`);
          default:
            break;
        }
      });
  } 
  generateSkeletons() {
    if (this.frame % (50 + (Math.floor(this.rng.next() * 25))) === 0 && this.game.current === this.gameState.game) {
      this.game.entities.push(new Skeleton(this.cvs, this.ctx));
      // console.log(`Push Skeleton`)
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

  generateEnemies() {
    if (this.frame % (100 + (Math.floor(this.rng.next() * 25))) === 0 && this.game.current === this.gameState.game) {
      let num = Math.floor(Math.random() * 2) + 1;
      if (num === 1) {
        this.game.entities.push(new Skeleton(this.cvs, this.ctx));
      } else {
        this.game.entities.push(new Dragon(this.cvs, this.ctx));
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
  
  render() {
    return (
      <div tabIndex="0" onKeyDown={this.onKeyPressed} onKeyUp={this.onKeyUp}>
        <canvas ref="canvas" id="run-escape" width="800" height="500"></canvas>
      </div>
    );
  }


  draw() {
    // console.log(`Draw, game state: ${this.game.current}`);
    this.ctx.fillStyle = '#866286';
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    this.bg.draw();
    this.fg.draw();
    this.game.entities.forEach(entity => entity.draw())
    this.gameScore.draw(this.game);
    this.getReady.draw(this.game);
    this.gameOver.draw(this.game);
    this.controlPrompt.draw(this.game);
  }

  update() {
    // console.log(`Update`);
    this.removeSkeleton();
    this.removeDragon();
    this.game.entities.forEach(entity => {
      if (entity instanceof Player)
        entity.update(this.game, this.increaseSpeed)
      else
        entity.update(this.game, this.gameScore, this.gameOverAction)
    })
    this.gameScore.update(this.game);
    this.bg.update(this.game);
    this.fg.update(this.game);
    this.generateEnemies();
  }

  renderGame() {

    const lobby = this.props.lobbies[this.props.lobbyId];

    lobby.players.map(playerId => 
      this.game.entities.push(new Player(this.cvs, this.ctx, playerId)))
    this.game.entities.push(new Skeleton(this.cvs, this.ctx));

;

    this.subscribeToPlayerActions();

    this.loop();
  }

  gameOverAction() {

    this.socket.emit("chat message", {
      lobbyId: this.props.lobbyId,
      msg: `${this.props.currentUser.username} met their end`
    })

    this.game.current = this.gameState.over;

    this.socket.emit("relay game state", {
      lobbyId: this.props.lobbyId,
      gameState: this.gameState.over
    });
    this.props.postScore(this.gameScore.score);
    // chara.reset();
    this.bg.reset();
    this.fg.reset();
  }




  increaseSpeed(dx){
    this.game.dx = this.game.dx + dx;
  }

  //loop
  loop() {
    // console.log(`Loop, frame: ${this.frame}`);

    this.update();
    this.draw();
    if (this.game.current && this.game.current !== this.gameState.over){
      this.frame++;
      // this.loop();
    }
    requestAnimationFrame(this.loop);
    if (this.game.current === this.gameState.over) {
      this.gameplay_music.pause();
      this.gameOver.gameover_music.play();
    }
  }
}
export default Game;