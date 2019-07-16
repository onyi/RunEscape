import React from 'react';
import run from '../../assets/game/run.png';
import getready from '../../assets/game/get-ready.png';
import gameover from '../../assets/game/game-over.png';
import backgroundimg from '../../assets/game/background.png';
import foregroundimg from '../../assets/game/foreground.png';

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

    const charaSprite = new Image();
    charaSprite.src = run;

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
    const chara = {
      animation: [
        { sX: 0, sY: 0 },
        { sX: 32, sY: 0 },
        { sX: 64, sY: 0 },
        { sX: 96, sY: 0 },
      ],
      x: 100,
      y: 388,
      w: 31,
      h: 41,
      jumpCount: 0,

      frame: 0,

      gravity: 0.25,
      jump: 4.6,
      speed: 0,

      draw: function () {
        let chara = this.animation[this.frame];

        ctx.drawImage(charaSprite, chara.sX, chara.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        // ctx.restore();
      },

      hop: function () {
        console.log(this.y)
        if (this.jumpCount > 0) {
          this.jumpCount -= 1;
          this.y = this.y - 1;
          this.speed = -this.jump;
        }
      },

      update: function () {
        //if the game state is get ready state, the chara must run slowly
        this.period = state.current == state.getReady ? 10 : 5;
        //increment the frame by 1, each period
        this.frame += frames % this.period == 0 ? 1 : 0;
        //frame goes from 0 to 4, then again to 0
        this.frame = this.frame % this.animation.length;

        if (state.current == state.getReady) {
          this.y = cvs.height - fg.h; //reset position of the chara after the game over
        } else {
          this.speed += this.gravity;

          //ground
          if (this.y >= cvs.height - fg.h) {
            this.y = cvs.height - fg.h;
            this.speed = 0;
            this.jumpCount = 2;
          }

          //air 
          if (this.y < cvs.height - fg.h) {
            this.y += this.speed;
          }
        }
      },

      speedReset: function () {
        this.speed = 0;
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


    //draw
    function draw() {
      ctx.fillStyle = '#866286';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      bg.draw();
      fg.draw();
      chara.draw();
      getReady.draw();
      gameOver.draw();
    }

    //update
    function update() {
      chara.update();
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