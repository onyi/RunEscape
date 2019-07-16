
import reisen from '../../assets/game/reisen.png';

class Player {
  constructor(canvas, context) {
    this.ctx = context;
    this.cvs = canvas;
    this.fg = {
      h: 59
    }

    this.animation = [
      { sX: 8, sY: 670, w: 88, h: 64 },
      { sX: 100, sY: 670, w: 86, h: 64 },
      { sX: 190, sY: 669, w: 81, h: 65 },
      { sX: 277, sY: 668, w: 84, h: 66 },
      { sX: 366, sY: 670, w: 88, h: 64 },
      { sX: 458, sY: 668, w: 86, h: 66 },
      { sX: 548, sY: 669, w: 82, h: 65 },
      { sX: 635, sY: 668, w: 84, h: 66 },
    ];

    this.sprite = new Image();
    this.sprite.src = reisen;

    this.x = 100;
    this.y = 388;
    this.jumpCount = 0;

    this.animationFrame = 0;
    this.frameTicks = 0;

    this.gravity = 0.25;
    this.jump = 5.6;
    this.speed = 0;
  }

  
  draw () {
    let chara = this.animation[this.animationFrame];

    this.ctx.drawImage(this.sprite, chara.sX, chara.sY, chara.w, chara.h, this.x, this.y, chara.w, chara.h);

    // ctx.restore();
  }

  hop() {
    if (this.jumpCount > 0) {
      this.jumpCount -= 1;
      this.y = this.y - 1;
      this.speed = -this.jump;
    }
  }

  update(state) {
    //if the game state is get ready state, the chara must run slowly
    this.period = state.current == state.getReady ? 10 : 5;
    //increment the animationFrame by 1, each period
    
    this.frameTicks++
    if( this.frameTicks % this.period === 0 ) {
      this.frameTicks = 0;
      this.animationFrame++;
    }

    //animationFrame goes from 0 to 8, then again to 0
    this.animationFrame = this.animationFrame % this.animation.length;

    if (state.current == state.getReady) {
      this.y = this.cvs.height - this.fg.h - 30; //reset position of the chara after the game over
    } else {
      this.speed += this.gravity;

      //ground
      if (this.y >= this.cvs.height - this.fg.h - 30) {
        this.y = this.cvs.height - this.fg.h - 30;
        this.speed = 0;
        this.jumpCount = 2;
      }

      //air 
      if (this.y < this.cvs.height - this.fg.h) {
        this.y += this.speed;
      }
    }
  }

  speedReset() {
    this.speed = 0;
  }
}

export default Player;