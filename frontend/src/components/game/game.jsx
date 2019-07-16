import React from 'react';
import Prando from 'prando';

import Player from './Player';
import Skeleton from './Skeleton';

import getready from '../../assets/game/get-ready.png';
import gameover from '../../assets/game/game-over.png';
import backgroundimg from '../../assets/game/background.png';
import foregroundimg from '../../assets/game/foreground.png';
import suddenatksound from '../../assets/game/sudden_attack.mp3';
import gg from '../../assets/game/gg.mp3';

class Game extends React.Component {

  componentDidMount() {
    this.renderGame();
  }
  
  render() {
    return (
      <canvas id="run-escape" width="800" height="500"></canvas>
    );
  }

  renderGame() {
    const cvs = document.getElementById('run-escape');
    const ctx = cvs.getContext('2d');
    const rng = new Prando("seed");

    //game vars and consts
    let frames = 0;

    const state = {
      localPlayerId: "tempPlayer1",
      current: 0,
      getReady: 0,
      game: 1,
      over: 2,
      entities: []
    }
    state.entities.push(new Player(cvs, ctx, state.localPlayerId));
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


    //control the game state
    document.addEventListener('keydown', function (e) {
      if (e.keyCode === 32) {
        switch (state.current) {
          case state.getReady:
            gameplay_music.currentTime = 0; 
            gameover_music.pause();
            gameover_music.currentTime = 0;
            gameplay_music.play();
            state.current = state.game;
            break;
          case state.game:
            let players = state.entities.filter(entity => typeof Player)
            let player = players.filter(player => state.localPlayerId === player.playerId);
            player[0].hop();
            break;
          case state.over:
            gameplay_music.pause();
            gameover_music.play();
            state.current = state.getReady;
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
        if (state.current == state.game) {
          this.x = (this.x - this.dx) % (this.w);
        }
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
        if (state.current == state.game) {
          this.x = (this.x - this.dx) % (this.w);
        }
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
        if (state.current == state.getReady) {
          ctx.drawImage(ready, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
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
        if (state.current == state.over) {
          ctx.drawImage(over, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        }
      }
    }

    function generateSkeletons() {
      
      if (frames % (50 + (Math.floor(rng.next() * 25))) == 0) {
        state.entities.push(new Skeleton(cvs, ctx));
      }
    }

    function draw() {
      ctx.fillStyle = '#866286';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      bg.draw();
      fg.draw();
      state.entities.forEach(entity => entity.draw())
      getReady.draw();
      gameOver.draw();
    }

    function update() {
      state.entities.forEach(entity => entity.update(state))
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
    }

    loop();
  }
}

export default Game;