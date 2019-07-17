import React from 'react';
import Prando from 'prando';
import openSocket from 'socket.io-client';

import Player from './Player';
import Skeleton from './Skeleton';
import Dragon from './Dragon';
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
      scores: props.scores,
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

  subscribeToPlayerActions(state) {
    
    this.socket.on(`relay action to ${this.props.match.params.lobbyId}`, 
      ({ playerId, playerAction}) => {
        console.log("Got input");
        let players = state.entities.filter(entity => typeof Player)
        let playerArr = players.filter(player => playerId === player.playerId);
        let player = playerArr[0];
        switch(playerAction) {
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
            player.airdash(state);
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
      dx: 8,
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
      // state.entities.push(new Skeleton(cvs, ctx));
      // state.entities.push(new Dragon(cvs, ctx));

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

    let players = state.entities.filter(entity => typeof Player)
    let player = players.filter(player => state.localPlayerId === player.playerId);

    const point_sound = new Audio();
    point_sound.src = pointSound;

    //control the game state
    document.addEventListener('keydown', (e) => {
      console.log(frames)
      if (e.keyCode === 32 || e.keyCode === 40 || e.keyCode === 39) {
        switch (state.current) {
          case state.getReady:
            state.dx = 8;
            gameplay_music.currentTime = 0; 
            gameover_music.currentTime = 0;
            gameplay_music.play();
            state.current = state.game;
            player[0].currentAnimation = player[0].runningAnimation;
            break;
          case state.game:
            if (e.keyCode === 32) {
              this.socket.emit("relay action", {
                lobbyId: state.lobbyId,
                playerId: state.localPlayerId,
                playerAction: "hop"
              })
            } else if (e.keyCode === 40 && player[0].jumpCount === 2) {
              this.socket.emit("relay action", {
                lobbyId: state.lobbyId,
                playerId: state.localPlayerId,
                playerAction: "slide"
              })
            } else if (e.keyCode === 40 && player[0].jumpCount !== 2) {
              this.socket.emit("relay action", {
                lobbyId: state.lobbyId,
                playerId: state.localPlayerId,
                playerAction:"fastfall" 
              })
            }

            if (e.keyCode === 39 && player[0].jumpCount !== 2) {
              this.socket.emit("relay action", {
                lobbyId: state.lobbyId,
                playerId: state.localPlayerId,
                playerAction: "airdash"
              })
            }
            
            // let players = state.entities.filter(entity => typeof Player)
            // let player = players.filter(player => state.localPlayerId === player.playerId);
            // debugger
            break;
          case state.over:
            state.current = state.getReady;
            player[0].currentAnimation = player[0].idleAnimation
            removeSkeletons();
            removeDragons();
            gameover_music.pause();   
            gameOverAction();
            break;
        }
      }
    })
    

    

    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 40 && state.current === state.game) {
        this.socket.emit("relay action", {
          lobbyId: state.lobbyId,
          playerId: state.localPlayerId,
          playerAction: "unslide"
        })
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



      draw: function () {
        ctx.drawImage(background, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)

        ctx.drawImage(background, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
      },

      update: function () {
        if (state.dx = frames % 1000 === 0 && state.dx < 10 && state.current === state.game ? state.dx += 1 : state.dx)
        if (state.current === state.game) {
          this.x = (this.x - state.dx) % (this.w);
        }
      },

    }

    //foreground
    const fg = {
      sX: 0,
      sY: 0,
      w: 800,
      h: 59,
      x: 0,
      y: cvs.height - 59,


      draw: function () {
        ctx.drawImage(foreground, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)

        ctx.drawImage(foreground, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
      },

      update: function () {
        if (state.dx = frames % 300 === 0 && state.dx < 20 && state.current === state.game ? state.dx += 1 : state.dx )
        if (state.current == state.game) {
          this.x = (this.x - state.dx) % (this.w);
        }
      },

      
    }

    //get ready message
    const getReady = {
      sX: 0,
      sY: 0,
      w: 141,
      h: 80,
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

    function generateEnemies() {
      
      if (frames % (100 + (Math.floor(rng.next() * 25))) === 0 && state.current === state.game) {
        let num = Math.floor(Math.random() * 2) + 1;
        if (num === 1) {
          state.entities.push(new Skeleton(cvs, ctx));
        } else {
          state.entities.push(new Dragon(cvs, ctx));
        }
      }
    
    }

    function generateDragons() {
      if (frames % (250 + (Math.floor(rng.next() * 33))) === 0 && state.current === state.game) {
        state.entities.push(new Dragon(cvs, ctx));
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
    
    function removeDragon(){
      for (let i = 0; i < state.entities.length; i++) {
        if (state.entities[i] instanceof Dragon) {
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

    function removeDragons() { 
      for (let i = 0; i < state.entities.length; i++) {
        if( state.entities[i] instanceof Dragon ) {
          delete state.entities[i];
          i--;
        }
      }
    }

    function gameOverAction(){
      that.props.postScore(state.gameScore.score);
     
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
      console.log(frames)
      removeSkeleton();
      removeDragon();
      state.entities.forEach(entity => entity.update(state))
      state.gameScore.update(state);
      bg.update();
      fg.update();
      // generateSkeletons();
      // generateDragons();
      generateEnemies();
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

    this.subscribeToPlayerActions(state);
    loop();
  }
}

export default Game;