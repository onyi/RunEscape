import React from 'react';
import getready from '../../assets/game/get-ready.png';
import gameover from '../../assets/game/game-over.png';
import backgroundimg from '../../assets/game/background.png';
import foregroundimg from '../../assets/game/foreground.png';
import skeletonimg from '../../assets/game/skeletonatk.png'
import Player from './Player';

class Game extends React.Component {

  componentDidMount() {
    this.renderGame();
  }
  
  render() {
    return(
      <canvas id="run-escape" width="800" height="500"></canvas>
    )
  }

  renderGame() {
    //select cvs 
    const cvs = document.getElementById('run-escape');
    const ctx = cvs.getContext('2d');

    //game vars and consts
    let frames = 0;

    //load sprite image

    const skeletonSprite = new Image();
    skeletonSprite.src = skeletonimg;

    const ready = new Image();
    ready.src = getready;

    const over = new Image();
    over.src = gameover;

    const background = new Image();
    background.src = backgroundimg;

    const foreground = new Image();
    foreground.src = foregroundimg;



    //game state
    const state = {
      current: 0,
      getReady: 0,
      game: 1,
      over: 2
    }

    //control the game state
    document.addEventListener('keydown', function (e) {
      if (e.keyCode === 32) {
        switch (state.current) {
          case state.getReady:
            state.current = state.game;
            break;
          case state.game:
            chara.hop();
            break;
          case state.over:
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
        if (this.dx = frames % 100 === 0 ? this.dx += 1 : this.dx)
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
        if (this.dx = frames % 100 === 0 ? this.dx += 1 : this.dx )
        if (state.current == state.game) {
          this.x = (this.x - this.dx) % (this.w);
        }
      }
    }

    //chara
    const chara = new Player(cvs, ctx);

    //skeleton monster 

    const skeleton = {

      position: [],

      animation: [

        { sX: 731, sY: 0 },
        { sX: 688, sY: 0 },
        { sX: 645, sY: 0 },
        { sX: 559, sY: 0 },
        { sX: 516, sY: 0 },
        { sX: 473, sY: 0 },
        { sX: 430, sY: 0 },
        { sX: 387, sY: 0 },
        { sX: 344, sY: 0 },
        { sX: 301, sY: 0 },
        { sX: 258, sY: 0 },
        { sX: 215, sY: 0 },
        { sX: 172, sY: 0 },
        { sX: 129, sY: 0 },
        { sX: 86, sY: 0 },
        { sX: 43, sY: 0 },
        { sX: 0, sY: 0 },

      ],


      w: 43,
      h: 37,
      dx: 8,
      frame: 0,

      draw: function () {
        for (let i = 0; i < this.position.length; i++) {
          let p = this.position[i];
          let skeleton = this.animation[this.frame]

          ctx.drawImage(skeletonSprite, skeleton.sX, skeleton.sY, this.w, this.h, p.x, p.y, this.w * 2, this.h * 2);
        }

      },

      update: function () {
        this.period = state.current == state.getReady ? 6 : 5;
        this.frame += frames % this.period == 0 ? 1 : 0;
        this.frame = this.frame % this.animation.length;


        if (state.current !== state.game) return;

        //pushes skeletons in arr 
        if (frames % (50 + (Math.floor(Math.random() * 25))) == 0) {
          this.position.push({
            x: cvs.width,
            y: cvs.height - fg.h - 30,
          });
        }

        for (let i = 0; i < this.position.length; i++) {
          let p = this.position[i];

          if (chara.x> p.x && chara.x < p.x + this.w && chara.y > p.y && chara.y < p.y + this.h) {
            state.current = state.over;
            skeleton.reset();
          }

          p.x -= this.dx;

          //removes skeleton 
          if (p.x + this.w + this.w <= 0) {
            this.position.shift();
          }
        }

      },

      reset: function () {
        this.position = [];
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


    //draw
    function draw() {
      ctx.fillStyle = '#866286';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      bg.draw();
      fg.draw();
      chara.draw();
      skeleton.draw();
      getReady.draw();
      gameOver.draw();
    }

    //update
    function update() {
      chara.update(state);
      skeleton.update();
      bg.update();
      fg.update();
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