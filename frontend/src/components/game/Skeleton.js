
import skeletonimg from '../../assets/game/skeletonatk.png'

class Skeleton {
  constructor(canvas, context) {
    this.ctx = context;
    this.cvs = canvas;
    this.fg = {
      h: 59
    }

    // this.position = [];
    this.x = this.cvs.width;
    this.y = this.cvs.height - this.fg.h - 30;

    this.w = 43;
    this.h = 37;
    this.dx = 8;
    
    this.sprite = new Image();
    this.sprite.src = skeletonimg;
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
}

  draw() {
    // for (let i = 0; i < this.position.length; i++) {
      // let p = this.position[i];
      let skeleton = this.animation[this.animationFrame];

      this.ctx.drawImage(this.sprite, skeleton.sX, skeleton.sY, this.w, this.h, this.x, this.y, this.w * 2, this.h * 2);
    // }

  }

  update(state) {
    this.period = state.current == state.getReady ? 6 : 5;
    
    this.frameTicks++;
    if (this.frameTicks % this.period === 0) {
      // this.frameTicks = 0;
      this.animationFrame++;
    }

    this.animationFrame = this.animationFrame % this.animation.length;


    if (state.current !== state.game) return;

    //pushes skeletons in arr 
    // Implement in PRANDO
    // if (frames % (50 + (Math.floor(Math.random() * 25))) == 0) {
    //   this.position.push({
    //     x: this.cvs.width,
    //     y: this.cvs.height - fg.h - 30,
    //   });
    // }

    // for (let i = 0; i < this.position.length; i++) {
      // let p = this.position[i];

      // if (chara.x > p.x && chara.x < p.x + this.w && chara.y > p.y && chara.y < p.y + this.h) {
      //   state.current = state.over;
      //   skeleton.reset();
      // }

      this.x -= this.dx;

      //removes skeleton 
      // if (p.x + this.w + this.w <= 0) {
      //   this.position.shift();
      // }
    // }
  }

  reset() {
    // this.position = [];
  }
}

export default Skeleton;