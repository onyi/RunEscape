import getready from '../../assets/game/get-ready.png';

var gameState = require('./GameState');


class GetReady {
  constructor(canvas, context) {
    this.ctx = context;
    this.cvs = canvas;

    this.sX = 0;
    this.sY = 0;
    this.w = 141;
    this.h = 80;
    this.x = this.cvs.width / 2 - 141 / 2;
    this.y = 150;

    this.ready = new Image();
    this.ready.src = getready;
  }

  draw(state) {
    if (state.current === gameState.getReady) {
      this.ctx.drawImage(this.ready, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
      // state.gameScore.reset();
    }
  }

  update(state) {

  }

  reset() {

  }

}

export default GetReady;