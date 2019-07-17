import React from 'react';
import Prando from 'prando';
import openSocket from 'socket.io-client';

import Player from './Player';
import Skeleton from './Skeleton';

import Background from './Background';
import Foreground from './Foreground';

import GameOver from './GameOver';
import GetReady from './GetReady';

import suddenatksound from '../../assets/game/lunatic_eyes.mp3';
import pointSound from '../../assets/game/sfx_point.wav';

import Score from './Score';

class Game extends React.Component {

  constructor(props){
    super(props);
    let cvs = document.getElementById('run-escape');
    let ctx = cvs.getContext('2d');
    this.cvs = cvs;
    this.ctx = ctx;
    this.gameState = {
      current: 0,
      getReady: 0,
      game: 1,
      over: 2,
    }
    let rng = Prando(this.props.lobbyId);
    this.rng = rng;
    this.gameScore = new Score(cvs, ctx);
    this.state = {
      scores: props.scores,
      gameState: 0,
      localPlayerId: props.currentUser.id,
      current: 0,
      entities: [],
      isOver: false,
      frame: 0
    };
    this.renderGame = this.renderGame.bind(this);
    this.socket = openSocket(window.location.origin);
    this.lobbyId = props.lobbyId
    this.mountController = this.mountController.bind(this);
    this.frame = 0;
    this.gameOver = new GameOver(this.cvs, this.ctx);
    this.getReady = new GetReady(this.cvs, this.ctx);
  }

  gameOver(){
    this.socket.emit("chat message", {
      lobbyId: this.props.lobbyId,
      msg: `${this.props.currentUser.username} met their end`
    })
    // gameOverAction();

    this.socket.emit("relay game state", {
      lobbyId: this.props.lobbyId,
      gameState: this.gameState.over
    });
    this.props.postScore(this.gameScore.score);

    this.setState({
      current: this.gameState.over
    })
  }

  componentDidMount() {
    this.props.getScores();
    // this.setState({
    //   cvs: document.getElementById('run-escape'),
    //   ctx: cvs.getContext('2d')
    // });
    this.bg = new Background(this.cvs, this.ctx);
    this.fg = new Foreground(this.cvs, this.ctx);
    this.mountController();

    this.renderGame();
  }

  componentWillUnmount() {
    this.socket.off(`relay action to ${this.props.match.params.lobbyId}`);
  }

  mountController() {
    
    this.socket.on(`relay action to ${this.props.lobbyId}`, 
      ({ playerId, playerAction}) => {
        console.log("Got input");
        let players = this.state.entities.filter(entity => typeof Player)
        let playerArr = players.filter(player => playerId === player.playerId);
        let player = playerArr[0];
        switch(playerAction) {
          case "hop":
            player.hop();
            break;
          default:
            break;
        }
      });

    this.socket.on(`relay game state to ${this.props.lobbyId}`,
      ({ lobbyId, gameState }) => {
        console.log(`receive new game state from lobby ${lobbyId}`);
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
    this.ctx.fillStyle = '#866286';
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    this.bg.draw();
    this.fg.draw();
    this.state.entities.forEach(entity => entity.draw())
    this.gameScore.draw(this.state);
    this.getReady.draw(this.state);
    this.gameOver.draw(this.state);
  }

  update() {
    this.removeSkeleton();
    this.state.entities.forEach(entity => entity.update(this.state))
    this.state.gameScore.update(this.state);
    this.bg.update();
    this.fg.update();
    this.generateSkeletons();
  }

  generateSkeletons() {
    if (this.state.frames % (50 + (Math.floor(this.rng.next() * 25))) === 0 && this.state.current === this.gameState.game) {
      this.state.entities.push(new Skeleton(this.cvs, this.ctx));
    }
  }

  removeSkeleton() {
    for (let i = 0; i < this.state.entities.length; i++) {
      if (this.state.entities[i] instanceof Skeleton) {
        if (this.state.entities[i].x < 0 - this.state.entities[i].w) {
          delete this.state.entities[i];
          i--;
        }
      }
    }
  }

  removeSkeletons() {
    for (let i = 0; i < this.state.entities.length; i++) {
      if (this.state.entities[i] instanceof Skeleton) {
        delete this.state.entities[i];
        i--;
      }
    }
  }
  
  render() {


    
    return (
      <canvas id="run-escape" width="800" height="500"></canvas>
    );
  }

  renderGame() {

    const that = this;
    const lobby = this.props.lobbies[this.props.lobbyId];

    lobby.players.map(playerId => 
      this.state.entities.push(new Player(this.cvs, this.ctx, playerId)))
    this.state.entities.push(new Skeleton(this.cvs, this.ctx));

    //load sprite image

    const gameplay_music = new Audio();
    gameplay_music.src = suddenatksound; 

    const point_sound = new Audio();
    point_sound.src = pointSound;

    //control the game state
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 32) {
        switch (this.state.current) {
          case this.gameState.getReady:
            this.gameOver.gameplay_music.currentTime = 0; 
            this.gameOver.gameover_music.currentTime = 0;
            this.gameOver.gameplay_music.play();
            this.state.current = this.gameState.game;
            this.socket.emit("relay game state", {
              lobbyId: this.lobbyId,
              gameState: this.gameState.game
            });
            break;
          case this.gameState.game:
            // let players = state.entities.filter(entity => typeof Player)
            // let player = players.filter(player => state.localPlayerId === player.playerId);
            this.socket.emit("relay action", {
              lobbyId: this.lobbyId,
              playerId: this.state.localPlayerId,
              playerAction: "hop"
            })
            break;
          case this.gameState.over:
            this.setState({
              current: this.gameState.getReady
            })
            this.removeSkeletons();
            this.gameOver.gameover_music.pause();
            this.socket.emit("relay game state", {
              lobbyId: that.props.lobbyId,
              gameState: this.gameState.getReady
            });
            break;
        }
      }
    })
  }

  gameOverAction() {
    this.socket.emit("relay game state", {
      lobbyId: this.lobbyId,
      gameState: this.gameState.over
    });
    this.props.postScore(this.gameScore.score);
    // chara.reset();
    this.bg.reset();
    this.fg.reset();
  }

  //loop
  loop() {
    this.update();
    this.draw();
    this.frames++;
    // requestAnimationFrame(loop);
    if (this.state.current === this.gameState.over) {
      this.gameOver.gameplay_music.pause();
      this.gameOver.gameover_music.play();
    }
  }
}

export default Game;