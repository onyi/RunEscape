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
      scores: this.props.scores,
      gameState: 0,
      localPlayerId: this.props.currentUser.id,
      current: 0,
      entities: [],
      isOver: false,
      scores: props.scores,
      dx: 8
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
    this.state = {
      scores: this.props.scores,
      gameState: 0,
      localPlayerId: this.props.currentUser.id,
      current: 0,
      entities: [],
      isOver: false,
    };
    this.renderGame = this.renderGame.bind(this);
    this.lobbyId = this.props.lobbyId
    this.frame = 0;


    // let cvs = document.getElementById('run-escape');
    // let ctx = cvs.getContext('2d');
    this.setState({
      cvs: canvas,
      ctx: context
    });
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
    if (e.keyCode === 40 && this.state.current === this.gameState.game) {
      this.socket.emit("relay action", {
        lobbyId: this.props.lobbyId,
        playerId: this.state.localPlayerId,
        playerAction: "unslide"
      })
    }
  }

  onKeyPressed(e){
    //control the game state
    // console.log(`onKeyPressed`);

    let player = this.state.entities.filter(entity => 
      entity instanceof Player && entity.playerId === this.props.currentUser.id);
    // let player = players.filter(player => this.state.localPlayerId === player.playerId)[0];
    if (e.keyCode === 32 || e.keyCode === 40 || e.keyCode === 39) {
      switch (this.state.current) {
        case this.gameState.getReady:
          this.gameplay_music.currentTime = 0;
          this.gameOver.gameover_music.currentTime = 0;
          this.gameplay_music.play();
          player.currentAnimation = player.runningAnimation;
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
          } else if (e.keyCode === 40 && player.jumpCount === 2) {
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
              dx: this.state.dx += 6
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
      }
    }
  }


  addPlayerstoLobby() {
    let entities = [];
    // this.props.lobbies[this.lobbyId].players.map(playerId => 
    //   state.entities.push(new Player(state.cvs, state.ctx, playerId)))

    for (let i = 0; i < this.props.lobbies[this.lobbyId].players.length; i++) {
      entities.push(new Player(this.cvs, this.ctx, this.props.lobbies[this.lobbyId].players[i], i * 20))
    }
    this.setState({
      entities
    })
  }

  getCurrentPlayer(state) {
    return this.state.entities.filter(entity =>
      entity instanceof Player && entity.playerId === this.props.currentUser.id);
  }

  // Subscribe socket to player action relay
  subscribeToPlayerActions() {
    this.socket.on(`relay action to ${this.lobbyId}`, 
      ({ playerId, playerAction}) => {
        let players = this.state.entities.filter(entity => 
          entity instanceof Player)
        let player = players.filter(player => 
          playerId === player.playerId)[0];
        if (player){
          switch(playerAction) {
            case "joinLobby":
              this.props.fetchLobby(this.lobbyId);
              this.addPlayerstoLobby();
              this.setState({});
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
              console.log(`Airdash`);
              this.increaseSpeed(6)
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
          case 1:
            console.log(`playing`);
            this.setState({
              gameState: 2
            });
          default:
            break;
        }
      });
  } 


  draw() {
    // console.log(`Draw, game state: ${this.state.current}`);
    this.ctx.fillStyle = '#866286';
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    this.bg.draw();
    this.fg.draw();
    this.state.entities.forEach(entity => entity.draw())
    this.gameScore.draw(this.state);
    this.getReady.draw(this.state);
    this.gameOver.draw(this.state);
    this.controlPrompt.draw(this.state)
  }

  update() {
    // console.log(`Update`);
    this.removeSkeleton();
    this.removeDragons();
    this.state.entities.forEach(entity => entity.update(this.state, this.gameScore, this.gameOverAction))
    this.gameScore.update(this.state);
    this.bg.update(this.state);
    this.fg.update(this.state);
    this.generateEnemies();
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
  
  render() {
    return (
      <div tabIndex="0" onKeyDown={this.onKeyPressed}>
        <canvas ref="canvas" id="run-escape" width="800" height="500"></canvas>
      </div>
    );
  }


  renderGame() {

    const lobby = this.props.lobbies[this.props.lobbyId];
    let entities = this.state.entities;

    lobby.players.map(playerId => 
      entities.push(new Player(this.cvs, this.ctx, playerId)))
    entities.push(new Skeleton(this.cvs, this.ctx));

    this.setState({
      entities: entities
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
}
export default Game;