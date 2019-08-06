import backgroundimg from '../../assets/game/background.png';

var GAME_STATE = require('./GameState');

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
    if (state.dx = state.frame % 1000 === 0 && state.dx < 10 && state.gameState === GAME_STATE.RUNNING ? state.dx += 1 : state.dx)
      if (state.gameState === GAME_STATE.RUNNING) {
        this.x = (this.x - state.dx) % (this.w);
    }
  }

  reset() {

  }
}

export default Background;