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

    this.state = {
      gameState: 0,
      localPlayerId: this.props.currentUser.id,
      current: 0,
      players: [],
      entities: [],
      isOver: false,
      scores: props.scores,
      dx: 8
    }
    window.game = this;

    this.gameState = require('./GameState');

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
    this.setState({
      scores: this.props.scores,
      gameState: 0,
      localPlayerId: this.props.currentUser.id,
      current: 0,
      entities: [],
      isOver: false,
      cvs: canvas,
      ctx: context
    });
    this.lobbyId = this.props.lobbyId
    this.frame = 0;
    this.bg = new Background(canvas, context);
    this.fg = new Foreground(canvas, context);

    this.getReady = new GetReady(this.cvs, this.ctx);
    this.gameOver = new GameOver(this.cvs, this.ctx);

    this.controlPrompt = new ControlPrompt(this.cvs, this.ctx);

    this.addPlayertoLobby(this.state.localPlayerId);
    this.props.fetchLobby(this.lobbyId)
      .then(payload => {
        this.lobby = payload.lobby;
        this.addPlayerstoLobby(payload.lobby);
      })
      .then(() => this.mountController());

    this.renderGame();
    
  }

  componentWillUnmount() {
    this.socket.off(`relay action to ${this.lobbyId}`);
    this.socket.off(`relay game state to ${this.lobbyId}`); 
  }

  mountController() {
    document.addEventListener('keydown', (e) => {
      let player = this.getCurrentPlayer();

      if (e.keyCode === 32 || e.keyCode === 40 || e.keyCode === 39) {
        switch (this.state.current) {
          case this.gameState.getReady:
            this.gameplay_music.currentTime = 0;
            this.gameOver.gameover_music.currentTime = 0;
            this.gameplay_music.play();
            player.currentAnimation = player.runningAnimation;
            this.gameScore.reset();
            this.setState({
              current: this.gameState.game
            })
            break;
          case this.gameState.game:
            if (e.keyCode === 32) {
              this.socket.emit("relay action", {
                lobbyId: this.lobbyId,
                playerId: this.state.localPlayerId,
                playerAction: "hop"
              })
            } else if (e.keyCode === 40 && player.jumpCount !== 2) {
              this.socket.emit("relay action", {
                lobbyId: this.lobbyId,
                playerId: this.state.localPlayerId,
                playerAction: "fastfall"
              })
            } else if (e.keyCode === 40 && player.jumpCount === 2 && player.sliding === false) {
              this.socket.emit("relay action", {
                lobbyId: this.lobbyId,
                playerId: this.state.localPlayerId,
                playerAction: "slide"
              })
            }

            if (e.keyCode === 39 && player.airDashCount > 0) {
              this.socket.emit("relay action", {
                lobbyId: this.lobbyId,
                playerId: this.state.localPlayerId,
                playerAction: "airdash"
              });
              this.setState({
                dx: this.state.dx + 6
              })
            }
            break;
          case this.gameState.over:
            player.currentAnimation = player.idleAnimation
            this.removeSkeletons();
            this.removeDragons();
            this.gameOver.gameover_music.pause();
            this.gameOverAction();
            this.setState({
              current: this.gameState.getReady
            })
            break;
          default:
            break;
        }
      }
    })

    document.addEventListener('keyup', (e) => {
      let player = this.getCurrentPlayer();
      if (e.keyCode === 40 && this.state.current === this.gameState.game && player.sliding === true) {
        this.socket.emit("relay action", {
          lobbyId: this.props.lobbyId,
          playerId: this.state.localPlayerId,
          playerAction: "unslide"
        })
      }
    })
  }

  addPlayertoLobby(playerId) {
    let playerIds = this.state.players.map(player => player.playerId)
    let players = this.state.players;

    if (!playerIds.includes(playerId))
      players.push(new Player(this.cvs, this.ctx, playerId, players.length * 20));

    this.setState({
      players
    });
    
  }

  addPlayerstoLobby(lobby) {
    let playerIds = this.state.players.map(player => player.playerId);

    let players = this.state.players;
    for (let i = 0; i < lobby.players.length; i++) {
      if (!playerIds.includes(lobby.players[i].playerId))
        players.push(new Player(this.cvs, this.ctx, lobby.players[i], 20 + i * 20));
    }

    this.setState({
      players
    });
  }

  removePlayerFromLobby(playerId) {
    let players = this.state.players;
    let index = players.indexOf(playerId);
    players.splice(index, 1);

    this.setState({
      players
    })
  }

  getCurrentPlayer() {
    return this.state.players.filter(entity =>
      entity instanceof Player && entity.playerId === this.props.currentUser.id)[0];
  }

  // Subscribe socket to player action relay
  subscribeToPlayerActions() {
    this.socket.on(`relay action to ${this.lobbyId}`, 
      ({ playerId, playerAction}) => {
        let player = this.state.players.filter(player => player.playerId === playerId)[0];
        
        if(playerAction === "joinLobby") {
          this.addPlayertoLobby(playerId);
        }

        if (player){
          switch(playerAction) {
            case "leaveLobby":
              this.removePlayerFromLobby(playerId);
              break;
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
            this.setState({
              gameState: 2
            });
            break;
          case 1:
            console.log(`playing`);
            this.setState({
              gameState: 2
            });
            break;
          default:
            break;
        }
      });
  } 

  generateSkeletons() {
    let entities = this.state.entities;
    if (this.frame % (50 + (Math.floor(this.rng.next() * 25))) === 0 && this.state.current === this.gameState.game) {
      entities.push(new Skeleton(this.cvs, this.ctx));
      // console.log(`Push Skeleton`)
    }
    this.setState({
      entities: entities
    })
  }

  removeSkeleton() {
    let entities = this.state.entities;

    for (let i = 0; i < entities.length; i++) {
      if (entities[i] instanceof Skeleton) {
        if (entities[i].x < 0 - entities[i].w) {
          delete entities[i];
          i--;
        }
      }
    }
    this.setState({
      entities: entities
    })
  }

  removeSkeletons() {
    let entities = this.state.entities;
    for (let i = 0; i < entities.length; i++) {
      if (entities[i] instanceof Skeleton) {
        delete entities[i];
        i--;
      }
    }
    this.setState({
      entities
    })
  }

  generateEnemies() {
    let entities = this.state.entities;
    if (this.frame % (100 + (Math.floor(this.rng.next() * 25))) === 0 && this.state.current === this.gameState.game) {
      let num = Math.floor(Math.random() * 2) + 1;
      if (num === 1) {
        entities.push(new Skeleton(this.cvs, this.ctx));
      } else {
        entities.push(new Dragon(this.cvs, this.ctx));
      }
    }
    this.setState({
      entities
    })
  }

  removeDragon() {
    let entities = this.state.entities;

    for (let i = 0; i < entities.length; i++) {
      if (entities[i] instanceof Dragon) {
        if (entities[i].x < 0 - entities[i].w) {
          delete entities[i];
          i--;
        }
      }
    }
    this.setState({
      entities
    })
  }

  removeDragons() {
    let entities = this.state.entities;

    for (let i = 0; i < entities.length; i++) {
      if (entities[i] instanceof Dragon) {
        delete entities[i];
        i--;
      }
    }
    this.setState({
      entities
    })
  }

  draw() {
    this.ctx.fillStyle = '#866286';
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    this.bg.draw();
    this.fg.draw();
    this.state.players.forEach(entity => entity.draw())
    this.state.entities.forEach(entity => entity.draw())
    this.gameScore.draw(this.state);
    this.getReady.draw(this.state);
    this.gameOver.draw(this.state);
    this.controlPrompt.draw(this.state);
  }

  update() {
    this.removeSkeleton();
    this.removeDragon();
    this.state.players.forEach(entity => {
      entity.update(this.state, this.increaseSpeed)
    });

    this.state.entities.forEach(entity => {
      entity.update(this.state, this.gameScore, this.gameOverAction)
    })
    this.gameScore.update(this.state);
    this.bg.update(this.state);
    this.fg.update(this.state);
    this.generateEnemies();
  }

  renderGame() {
    let entities = this.state.entities;

    entities.push(new Skeleton(this.cvs, this.ctx));

    this.setState({
      entities
    });

    this.subscribeToPlayerActions();
    this.loop();
  }

  gameOverAction() {

    this.socket.emit("chat message", {
      lobbyId: this.props.lobbyId,
      msg: `${this.props.currentUser.username} met their end`
    })

    this.setState({
      current: this.gameState.over
    })

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
    this.setState({
      dx: this.state.dx + dx
    })
  }

  //loop
  loop() {
    // console.log(`Loop, frame: ${this.frame}`);

    this.update();
    this.draw();
    if (this.state.current && this.state.current !== this.gameState.over){
      this.frame++;
      // this.loop();
    }
    requestAnimationFrame(this.loop);
    if (this.state.current === this.gameState.over) {
      this.gameplay_music.pause();
      this.gameOver.gameover_music.play();
    }
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