import foregroundimg from '../../assets/game/foreground.png';

var gameState = require('./GameState');


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

    this.foreground = new Image();
    this.foreground.src = foregroundimg;
  }

  draw(state) {
    this.ctx.drawImage(this.foreground, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    this.ctx.drawImage(this.foreground, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
  }

  update(state) {
    if (state.dx = state.frame % 300 === 0 && state.dx < 20 && state.current === gameState.game ? state.dx += 1 : state.dx)
      if (state.current === gameState.game) {
        this.x = (this.x - state.dx) % (this.w);
      }
  }

  reset() {

  }

}

export default Foreground;