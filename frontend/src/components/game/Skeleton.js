
import skeletonimg from '../../assets/game/skeletonatk.png';
import hitsound from '../../assets/game/hit.wav';
import pointSound from '../../assets/game/sfx_point.wav';

import Player from './Player';

const GAME_STATE = require('./GameState');

class Skeleton {
  constructor(canvas, context) {
    this.ctx = context;
    this.cvs = canvas;
    this.fg = {
      h: 59
    }

    // this.position = [];
    this.x = this.cvs.width;
    this.y = this.cvs.height - this.fg.h - 45;

    this.w = 43;
    this.h = 37;
    
    this.sprite = new Image();
    this.sprite.src = skeletonimg;
    this.hitSfx = new Audio();
    this.hitSfx.src = hitsound;
    this.frameTicks = 0;
    this.animationFrame = 0;
    this.animation = [
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
      { sX: 86,  sY: 0 },
      { sX: 43,  sY: 0 },
      { sX: 0,   sY: 0 },
      
      // { sX: 748, sY: 4, w: 22, h: 32, },
      // { sX: 706, sY: 4, w: 22, h: 32, },
      // { sX: 663, sY: 4, w: 21, h: 32, },
      // { sX: 621, sY: 5, w: 19, h: 32, },
      // { sX: 580, sY: 0, w: 18, h: 37, },
      // { sX: 537, sY: 1, w: 21, h: 36, },
      // { sX: 494, sY: 4, w: 22, h: 33, },
      // { sX: 430, sY: 1, w: 40, h: 36, },
      // { sX: 398, sY: 13, w: 31, h: 19, },
      // { sX: 347, sY: 16, w: 32, h: 21, },
      // { sX: 304, sY: 15, w: 32, h: 22, },
      // { sX: 260, sY: 15, w: 32, h: 22, },
      // { sX: 216, sY: 15, w: 33, h: 22, },
      // { sX: 176, sY: 15, w: 32, h: 22, },
      // { sX: 139, sY: 7, w: 27, h: 30, },
      // { sX: 106, sY: 5, w: 21, h: 32, },
      // { sX: 62, sY: 5, w: 21, h: 32, },
    ];
    this.passed = false;

    this.point_sound = new Audio();
    this.point_sound.src = pointSound;
}

  draw() {
    let skeleton = this.animation[this.animationFrame];

    this.ctx.drawImage(this.sprite, skeleton.sX, skeleton.sY, this.w, this.h, this.x, this.y, this.w * 2, this.h * 2);
  }

  update(state, gameScore, gameOver) {
    if (state.gameState !== GAME_STATE.RUNNING) return;
    this.period = state.gameState === GAME_STATE.READY ? 6 : 5;
    
    this.frameTicks++;
    if (this.frameTicks % this.period === 0) {
      this.frameTicks = 0;
      this.animationFrame++;
    }

    this.animationFrame = this.animationFrame % this.animation.length;

    // console.log(`Player ID: ${state.localPlayerId}`);

    let player = state.players.filter(entity =>
      entity instanceof Player && entity.playerId === state.localPlayerId )[0];
    if (player.alive &&
        player.x + 12 > this.x && 
        player.x - 12 < this.x + this.w && 
        player.y + 12 > this.y && 
        player.y - 12 < this.y + this.h) {
      this.hitSfx.play();
      player.alive = false;
      gameOver();
    }

    if (player.alive && player.x > (this.x + (this.w/2) ) && !this.passed ) {
      this.passed = true;
      this.point_sound.play();
      gameScore.addObstacleScore(100);
    }
    
    this.x -= state.dx;
  }
}

export default Skeleton;