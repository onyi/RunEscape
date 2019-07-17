import backgroundimg from '../../assets/game/background.png';


class Background {

  constructor(canvas, context){
    this.ctx = context;
    this.cvs = canvas;

    this.sX = 0;
    this.sY = 0;
    this.w = 800;
    this.h = 500;
    this.x = 0;
    this.y = 0;
    this.dx = 10;

    this.background = new Image();
    this.background.src = backgroundimg;
  }


  draw (state) {
    this.ctx.drawImage(this.background, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    this.ctx.drawImage(this.background, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
  }

  update(state) {
    if (this.dx = state.frames % 100 === 0 ? this.dx : this.dx)
    if (state.current === state.game) {
      this.x = (this.x - this.dx) % (this.w);
    }
  }

  reset() {
    this.dx = 10;
  }


}


export default Background;