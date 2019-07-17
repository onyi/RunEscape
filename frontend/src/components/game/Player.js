
import run from '../../assets/game/run.png';
import charajump from '../../assets/game/char.png'
import jumpsound from '../../assets/game/jump_sound_effect.mp3';

class Player {
  constructor(canvas, context, playerId) {
    this.ctx = context;
    this.cvs = canvas;
    this.playerId = playerId;
    this.fg = {
      h: 59
    }

    this.x = 100;
    this.y = 388;
    this.gravity = 0.25;
    this.jump = 5.6;
    this.speed = 0;
    this.jumpCount = 0;

    this.frameTicks = 0;
    this.animationFrame = 0;
    this.animation = [
      { sX: 0,   sY: 1, w: 86, h: 64 },
      { sX: 91,  sY: 0, w: 83, h: 66 },
      { sX: 180, sY: 1, w: 81, h: 65 },
      { sX: 265, sY: 0, w: 82, h: 66 },
      { sX: 352, sY: 2, w: 87, h: 64 },
      { sX: 443, sY: 0, w: 84, h: 66 },
      { sX: 532, sY: 1, w: 81, h: 65 },
      { sX: 617, sY: 0, w: 82, h: 66 },
    ];

    this.jump_animation = [
      { sX: 8,   sY: 2024, w: 45, h: 80 },
      { sX: 8,   sY: 2024, w: 45, h: 80 },
      { sX: 55,  sY: 2015, w: 63, h: 74 },
      { sX: 115, sY: 2015, w: 62, h: 85 },
      { sX: 180, sY: 2015, w: 60, h: 87 },
      { sX: 240, sY: 2015, w: 56, h: 86 },
      { sX: 300, sY: 2015, w: 65, h: 89 },
      { sX: 363, sY: 2015, w: 66, h: 89 },
    ];

    // Assets
    this.sprite = new Image();
    this.sprite.src = run;
    this.spritejump = new Image();
    this.spritejump.src = charajump;
    this.jumpSfx = new Audio();
    this.jumpSfx.src = jumpsound;

  }
  
  draw () {
    let chara = this.animation[this.animationFrame];
    let jumping = this.jump_animation[this.animationFrame];

    if (this.y < this.cvs.height - this.fg.h - 30) {
      this.ctx.drawImage(this.spritejump, jumping.sX, jumping.sY, jumping.w, jumping.h, this.x, this.y, jumping.w, jumping.h);        
    } else {
      this.ctx.drawImage(this.sprite, chara.sX, chara.sY, chara.w, chara.h, this.x, this.y, chara.w, chara.h);
    }
  }

  hop() {
    this.jumpSfx.play();
    if (this.jumpCount > 0) {
      this.jumpCount -= 1;
      this.y = this.y - 1;
      this.speed = -this.jump;
    }
  }

  update(state) {
    //if the game state is get ready state, the chara must run slowly
    this.period = state.current === state.getReady ? 10 : 5;

    // count frames that have elapsed, increment the animationFrame by 1 each period
    this.frameTicks++;
    if( this.frameTicks % this.period === 0 ) {
      this.frameTicks = 0;
      this.animationFrame++;
    }

    //animationFrame goes from 0 to 8, then again to 0
    this.animationFrame = this.animationFrame % this.animation.length;

    if (state.current === state.getReady) {
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

  reset(){
    this.speed = 0;
    this.dx = 10;
  }
}

export default Player;