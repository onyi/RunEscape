
import enemies from '../../assets/game/enemies.png';
import hitsound from '../../assets/game/hit.wav';

class Dragon {
  constructor(canvas, context) {
    this.ctx = context;
    this.cvs = canvas;
    this.fg = {
      h: 59
    }

    // this.position = [];
    this.sprite = new Image();
    this.sprite.src = enemies;
    this.x = this.cvs.width;
    this.y = this.cvs.height - this.fg.h - 45;
    this.dx = 8;

    this.frameTicks = 0;
    this.animationFrame = 0;
    this.animation = [
      { sX: 179, sY: 317, w: 43, h: 43 },
      { sX: 688, sY: 0,  },
      { sX: 645, sY: 0 },
      { sX: 559, sY: 0 },
      { sX: 516, sY: 0 },
    ];
  }

  draw() {
    let dragon = this.animation[this.animationFrame];

    this.ctx.drawImage(this.sprite, dragon.sX, dragon.sY, this.w, this.h, this.x, this.y, this.w * 2, this.h * 2);
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

    this.x -= this.dx;
  }
}

export default Dragon;