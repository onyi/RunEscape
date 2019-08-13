import foregroundimg from '../../assets/game/foreground.png';

const GAME_STATE = require('./GameState');

const DEFAULT = {
  sX: 0,
  sY: 0,
  w: 800,
  h: 59,
  x: 0,
}

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
    if (state.gameState === GAME_STATE.RUNNING) {
      this.x = (this.x - state.dx) % (this.w);
    }
    // if (state.dx = state.frame % 300 === 0 && 
    //   state.dx < 20 && 
    //   state.gameState === GAME_STATE.RUNNING ? state.dx += 1 : state.dx)
  }

  reset() {
    this.sX = DEFAULT.sX;
    this.sY = DEFAULT.sY;
    this.w = DEFAULT.w;
    this.h = DEFAULT.h;
    this.x = DEFAULT.x;
    this.y = this.cvs.height - 59;
  }

}

export default Foreground;