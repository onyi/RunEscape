
import reisen from '../../assets/game/reisen.png';

class Player {
  constructor(canvas, context) {
    this.ctx = context;
    this.cvs = canvas;
    this.fg = {
      h: 59
    }

    this.currentAnimation = [
      { sX: 8, sY: 5101, w: 44, h: 86 },
      { sX: 57, sY: 5102, w: 43, h: 85 },
      { sX: 105, sY: 5101, w: 43, h: 86 },
      { sX: 153, sY: 5102, w: 44, h: 85 },
      { sX: 202, sY: 5103, w: 42, h: 84 },
      { sX: 248, sY: 5103, w: 44, h: 84 },
      { sX: 297, sY: 5105, w: 46, h: 82 },
      { sX: 348, sY: 5105, w: 43, h: 84 },
      { sX: 396, sY: 5100, w: 50, h: 87 },
    ];

    this.idleAnimation = [
      { sX: 8, sY: 5101, w: 44, h: 86 },
      { sX: 57, sY: 5102, w: 43, h: 85 },
      { sX: 105, sY: 5101, w: 43, h: 86 },
      { sX: 153, sY: 5102, w: 44, h: 85 },
      { sX: 202, sY: 5103, w: 42, h: 84 },
      { sX: 248, sY: 5103, w: 44, h: 84 },
      { sX: 297, sY: 5105, w: 46, h: 82 },
      { sX: 348, sY: 5105, w: 43, h: 84 },
      { sX: 396, sY: 5100, w: 50, h: 87 },
    ]

    this.runningAnimation = [
      { sX: 8, sY: 670, w: 88, h: 64 },
      { sX: 100, sY: 670, w: 86, h: 64 },
      { sX: 190, sY: 669, w: 81, h: 65 },
      { sX: 277, sY: 668, w: 84, h: 66 },
      { sX: 366, sY: 670, w: 88, h: 64 },
      { sX: 458, sY: 668, w: 86, h: 66 },
      { sX: 548, sY: 669, w: 82, h: 65 },
      { sX: 635, sY: 668, w: 84, h: 66 },
    ]

    this.slidingAnimation = [
      { sX: 8, sY: 2261, w: 66, h: 72 },
      { sX: 78, sY: 2266, w: 82, h: 67 },
      { sX: 165, sY: 2270, w: 92, h: 63 },
      { sX: 262, sY: 2271, w: 97, h: 62 },
      { sX: 364, sY: 670, w: 94, h: 62 },
    ];

    this.slidingHitBox = 33;

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
    let chara = this.currentAnimation[this.animationFrame];

    this.ctx.drawImage(this.sprite, chara.sX, chara.sY, chara.w, chara.h, this.x, this.y, chara.w, chara.h);
  }

  hop() {
    if (this.jumpCount > 0) {
      this.jumpCount -= 1;
      this.y = this.y - 1;
      this.speed = -this.jump;
    }
  }

  slide() {
    this.animationFrame = 0;
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
    this.animationFrame = this.animationFrame % this.currentAnimation.length;

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