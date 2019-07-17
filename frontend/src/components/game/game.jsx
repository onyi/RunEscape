import React from 'react';
import Prando from 'prando';
import openSocket from 'socket.io-client';

import Player from './Player';
import Skeleton from './Skeleton';

import getready from '../../assets/game/get-ready.png';
import gameover from '../../assets/game/game-over.png';
import backgroundimg from '../../assets/game/background.png';
import foregroundimg from '../../assets/game/foreground.png';
import suddenatksound from '../../assets/game/lunatic_eyes.mp3';
import gg from '../../assets/game/gg.mp3';
import pointSound from '../../assets/game/sfx_point.wav';

import Score from './Score';

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      scores: props.scores
    }
    this.renderGame = this.renderGame.bind(this);
    this.socket = openSocket('http://localhost:3000');

  }

  componentDidMount() {
    this.props.getScores();
    this.renderGame();
  }

  componentWillUnmount() {
    this.socket.off(`relay action to ${this.props.match.params.lobbyId}`);
  }

  mountController(state) {
    
    this.socket.on(`relay action to ${this.props.match.params.lobbyId}`, 
      ({ playerId, playerAction}) => {
        console.log("Got input");
        let players = state.entities.filter(entity => typeof Player)
        let playerArr = players.filter(player => playerId === player.playerId);
        let player = playerArr[0];
        switch(playerAction) {
          case "hop":
            player.hop();
            break;
          default:
            break;
        }
      })
  }
  
  render() {
    return (
      <canvas id="run-escape" width="800" height="500"></canvas>
    );
  }

  renderGame() {
    const that = this;

    //select cvs 
    const cvs = document.getElementById('run-escape');
    const ctx = cvs.getContext('2d');
    const lobby = this.props.lobbies[this.props.match.params.lobbyId]
    const rng = new Prando(lobby._id);

    //game vars and consts
    let frames = 0;

    const state = {
      localPlayerId: this.props.currentUser.id,
      lobbyId: lobby._id,
      current: 0,
      getReady: 0,
      game: 1,
      over: 2,
      entities: [],
      gameScore: new Score(cvs, ctx),
      gameOver: () => {
        this.socket.emit("chat message", {
          lobbyId: state.lobbyId,
          msg: `${this.props.currentUser.username} met their end`
        })
        state.current = state.over;
      }
    }
    lobby.players.map(playerId => 
      state.entities.push(new Player(cvs, ctx, playerId)))
    state.entities.push(new Skeleton(cvs, ctx));

    //load sprite image
    const ready = new Image();
    ready.src = getready;

    const over = new Image();
    over.src = gameover;

    const background = new Image();
    background.src = backgroundimg;

    const foreground = new Image();
    foreground.src = foregroundimg;

    const gameplay_music = new Audio();
    gameplay_music.src = suddenatksound; 

    const gameover_music = new Audio();
    gameover_music.src = gg;

    const point_sound = new Audio();
    point_sound.src = pointSound;

    //control the game state
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 32) {
        switch (state.current) {
          case state.getReady:
            gameplay_music.currentTime = 0; 
            gameover_music.currentTime = 0;
            gameplay_music.play();
            state.current = state.game;
            break;
          case state.game:
            // let players = state.entities.filter(entity => typeof Player)
            // let player = players.filter(player => state.localPlayerId === player.playerId);
            this.socket.emit("relay action", {
              lobbyId: state.lobbyId,
              playerId: state.localPlayerId,
              playerAction: "hop"
            })
            break;
          case state.over:
            state.current = state.getReady;
            removeSkeletons();
            gameover_music.pause();   
            gameOverAction();
            break;
        }
      }
    })

    //background 
    const bg = {
      sX: 0,
      sY: 0,
      w: 800,
      h: 500,
      x: 0,
      y: 0,

      dx: 10,

      draw: function () {
        ctx.drawImage(background, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)

        ctx.drawImage(background, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
      },

      update: function () {
        if (this.dx = frames % 100 === 0 ? this.dx : this.dx)
        if (state.current === state.game) {
          this.x = (this.x - this.dx) % (this.w);
        }
      },

      reset: function () {
        this.dx = 10;
      }
    }

    //foreground
    const fg = {
      sX: 0,
      sY: 0,
      w: 800,
      h: 59,
      x: 0,
      y: cvs.height - 59,

      dx: 10,

      draw: function () {
        ctx.drawImage(foreground, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)

        ctx.drawImage(foreground, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
      },

      update: function () {
        if (this.dx = frames % 100 === 0 ? this.dx : this.dx )
        if (state.current === state.game) {
          this.x = (this.x - this.dx) % (this.w);
        }
      },

      reset: function() {
        this.dx = 10;
      }
    }

    //get ready message
    const getReady = {
      sX: 0,
      sY: 0,
      w: 141,
      h: 50,
      x: cvs.width / 2 - 141 / 2,
      y: 150,

      draw: function () {
        if (state.current === state.getReady) {
          ctx.drawImage(ready, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
          state.gameScore.reset();
        }
      }
    }

    const gameOver = {
      sX: 0,
      sY: 0,
      w: 137,
      h: 82,
      x: cvs.width / 2 - 137 / 2,
      y: 90,

      draw: function () {
        if (state.current === state.over) {
          ctx.drawImage(over, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        }
      }
    }

    function generateSkeletons() {
      if (frames % (50 + (Math.floor(rng.next() * 25))) === 0 && state.current === state.game) {
        state.entities.push(new Skeleton(cvs, ctx));
      }
    }

    function removeSkeleton(){
      for (let i = 0; i < state.entities.length; i++) {
        if (state.entities[i] instanceof Skeleton) {
          if (state.entities[i].x <  0 - state.entities[i].w ){
            delete state.entities[i];
            i--;
          }
        }
      }
    }

    function removeSkeletons() { 
      for (let i = 0; i < state.entities.length; i++) {
        if( state.entities[i] instanceof Skeleton ) {
          delete state.entities[i];
          i--;
        }
      }
    }

    function gameOverAction(){
      that.props.postScore(state.gameScore.score);
      // chara.reset();
      bg.reset();
      fg.reset();
    }


    //draw
    function draw() {
      ctx.fillStyle = '#866286';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      bg.draw();
      fg.draw();
      state.entities.forEach(entity => entity.draw())
      state.gameScore.draw(state);
      getReady.draw();
      gameOver.draw();
    }

    function update() {
      removeSkeleton();
      state.entities.forEach(entity => entity.update(state))
      state.gameScore.update(state);
      bg.update();
      fg.update();
      generateSkeletons();
    }

    //loop
    function loop() {
      update();
      draw();
      frames++;
      requestAnimationFrame(loop);
      if (state.current === state.over) {
        gameplay_music.pause();
        gameover_music.play();
      }
    }

    this.mountController(state);
    loop();
  }
}

export default Game;