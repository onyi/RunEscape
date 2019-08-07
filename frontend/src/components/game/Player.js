
import reisen from '../../assets/game/reisen.png';
import charajump from '../../assets/game/char.png'
import jumpsound from '../../assets/game/jump_sound_effect.mp3';
import airdashsound from '../../assets/game/sfx_swooshing.mp3';

const GAME_STATE = require('./GameState');


class Player {
  constructor(canvas, context, playerId, xOffset = 0) {
    this.ctx = context;
    this.cvs = canvas;
    this.playerId = playerId;
    this.fg = {
      h: 59
    }
    this.sliding = false;

    this.x = 100 + xOffset;
    this.y = 388;
    this.gravity = 0.45;
    this.jump = 11.1;
    this.speed = 0;
    this.jumpCount = 2;
    this.airDashCount = 1; 
    this.slidingHitBox = this.y + 1000;
    this.frameTicks = 0;
    this.animationFrame = 0;
    this.alive = true;

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
      // { sX: 8, sY: 2261, w: 66, h: 72 },
      // { sX: 78, sY: 2266, w: 82, h: 67 },
      { sX: 165, sY: 2270, w: 92, h: 63 },
      { sX: 262, sY: 2271, w: 97, h: 62 },
      { sX: 364, sY: 2271, w: 94, h: 62 },
      { sX: 364, sY: 2271, w: 94, h: 62 },
      { sX: 364, sY: 2271, w: 94, h: 62 },
      { sX: 364, sY: 2271, w: 94, h: 62 },
      { sX: 364, sY: 2271, w: 94, h: 62 },
    ];
    
    this.jump_animation = [
      { sX: 8,   sY: 2024, w: 45, h: 80 },
      { sX: 8,   sY: 2024, w: 45, h: 80 },
      { sX: 55,  sY: 2015, w: 63, h: 74 },
      { sX: 115, sY: 2015, w: 62, h: 85 },
      { sX: 180, sY: 2015, w: 60, h: 87 },
      { sX: 240, sY: 2015, w: 56, h: 86 },
      // { sX: 300, sY: 2015, w: 65, h: 89 },
      // { sX: 363, sY: 2015, w: 66, h: 89 },
    ];

    this.airDashAnimation = [
      { sX: 8, sY: 548, w: 69, h: 72 },
      { sX: 83, sY: 561, w: 67, h: 59 },
      { sX: 156, sY: 565, w: 70, h: 55 },
      { sX: 231, sY: 559, w: 74, h: 61 },
      { sX: 311, sY: 554, w: 83, h: 66 },
      { sX: 398, sY: 553, w: 82, h: 67 },
      { sX: 485, sY: 552, w: 84, h: 68 },
    ];

    this.currentAnimation = this.idleAnimation;


    // Assets
    this.sprite = new Image();
    this.sprite.src = reisen;
    this.spritejump = new Image();
    this.spritejump.src = charajump;
    this.jumpSfx = new Audio();
    this.jumpSfx.src = jumpsound;
    this.airSfx = new Audio();
    this.airSfx.src = airdashsound; 
  }
  
  isGrounded() {
    return (this.y >= this.cvs.height - this.fg.h - 30);
  }

  hop() {
    if (this.jumpCount > 0) {
      this.jumpSfx.play();
      this.currentAnimation = this.jump_animation;
      this.animationFrame = 0;
      this.jumpCount -= 1;
      this.y = this.y - 20;
      this.speed = -this.jump;

      this.sliding = false;
    }
  }

  slide() {
    if (this.isGrounded() && !this.sliding) {
      this.sliding = true;
      this.currentAnimation = this.slidingAnimation;
      this.animationFrame = 0;
    }
  }

  unslide() {
    if (this.sliding) {
      this.sliding = false;
      this.currentAnimation = this.runningAnimation;
    }
  }

  fastfall() {
    this.speed = 8.5;
  }

  airdash(state) {
    if (this.airDashCount > 0) {
      this.airSfx.play();
      this.currentAnimation = this.airDashAnimation;
      this.airDashCount -= 1; 
      this.y = this.y - 1; 
      this.gravity = .20;
      this.speed = -2;
      setTimeout(() => {
        this.gravity = 0.45;
      }, 400)
    }
  }

  update(state, increaseSpeed) {
    if (state.gameState === GAME_STATE.OVER) return;

    // if the game state is get ready state, the chara animate slowly
    this.period = state.gameState === GAME_STATE.READY ? 10 : 5;

    // count frames that have elapsed, increment the animationFrame by 1 each period
    this.frameTicks++;
    if( this.frameTicks % this.period === 0 ) {
      this.frameTicks = 0;
      this.animationFrame++;
    }

    // loop animation frames, except for jumping
    if (this.currentAnimation === this.jump_animation && this.animationFrame >= this.currentAnimation.length) {
      this.animationFrame = this.currentAnimation.length - 1;
    } else {
      this.animationFrame = this.animationFrame % this.currentAnimation.length;
    }

    if (state.gameState === GAME_STATE.READY) {
      this.y = this.cvs.height - this.fg.h - 30; //reset position of the chara after the game over
    } else {
      this.speed += this.gravity;

      if (this.isGrounded()) {
        if (!this.sliding) this.currentAnimation = this.runningAnimation;

        this.y = this.cvs.height - this.fg.h - 30;
        this.speed = 0;
        this.jumpCount = 2;
        this.gravity = 0.45;
        if (this.airDashCount === 0) {
          increaseSpeed(-6);
          this.airDashCount = 1;
        }
      }

      if (!this.isGrounded()) {
        this.y += this.speed;
      }
    }
  }

  draw() {
    if(this.alive){
      let chara = this.currentAnimation[this.animationFrame];
      this.ctx.drawImage(this.sprite, chara.sX, chara.sY, chara.w, chara.h, this.x, this.y, chara.w, chara.h);
    }
  }

}

export default Player;