import foregroundimg from '../../assets/game/foreground.png';



class Foreground{
  constructor(canvas, context){
    this.ctx = context;
    this.cvs = canvas;

    this.sX = 0;
    this.sY = 0;
    this.w = 800;
    this.h = 59;
    this.x = 0;
    this.y = this.cvs.height - 59;
    this.dx = 10;

    this.foreground = new Image();
    this.foreground.src = foregroundimg;
  }

  draw(state) {
    this.ctx.drawImage(this.foreground, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    this.ctx.drawImage(this.foreground, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
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

export default Foreground;