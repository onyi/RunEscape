import backgroundimg from '../../assets/game/background.png';

var GAME_STATE = require('./GameState');

const DEFAULT = {
  sX: 0,
  sY: 0,
  w: 800,
  h: 500,
  x: 0,
  y: 0,
}

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

    this.background = new Image();
    this.background.src = backgroundimg;
  }

  draw (state) {
    // console.log(`Background Draw on ${this.ctx}`);
    this.ctx.drawImage(this.background, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    this.ctx.drawImage(this.background, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  }

  update(state) {
    if (state.gameState === GAME_STATE.RUNNING) {
      this.x = (this.x - state.dx) % (this.w);
    }
    // if (state.dx = state.frame % 1000 === 0 && state.dx < 10 && state.gameState === GAME_STATE.RUNNING ? state.dx += 1 : state.dx)
  }

  reset() {
    this.sX = DEFAULT.sX;
    this.sY = DEFAULT.sY;
    this.w = DEFAULT.w;
    this.h = DEFAULT.h;
    this.x = DEFAULT.x;
    this.y = DEFAULT.y;
  }
}

export default Background;