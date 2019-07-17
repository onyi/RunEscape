
import skeletonimg from '../../assets/game/skeletonatk.png';
import hitsound from '../../assets/game/hit.wav';
import pointSound from '../../assets/game/sfx_point.wav';

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
    this.dx = 8;
    
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
    ];
    this.passed = false;

    this.point_sound = new Audio();
    this.point_sound.src = pointSound;
}

  draw() {
    let skeleton = this.animation[this.animationFrame];

    this.ctx.drawImage(this.sprite, skeleton.sX, skeleton.sY, this.w, this.h, this.x, this.y, this.w * 2, this.h * 2);
  }

  update(state) {
    if (state.current !== state.game) return;
    
    this.period = state.current == state.getReady ? 6 : 5;
    
    this.frameTicks++;
    if (this.frameTicks % this.period === 0) {
      this.frameTicks = 0;
      this.animationFrame++;
    }

    this.animationFrame = this.animationFrame % this.animation.length;

    let players = state.entities.filter(entity => typeof Player)
    let player = players.filter(player => state.localPlayerId === player.playerId);
    player = player[0];
    if (player.x + 12 > this.x && 
        player.x - 12 < this.x + this.w && 
        player.y + 12 > this.y && 
        player.y - 12 < this.y + this.h) {
      this.hitSfx.play();
      state.current = state.over;
    }

    if(player.x > (this.x + (this.w/2) ) && !this.passed ) {
      this.passed = true;
      this.point_sound.play();
      state.gameScore.addObstacleScore(100);
    }
    
    this.x -= this.dx;
  }
}

export default Skeleton;