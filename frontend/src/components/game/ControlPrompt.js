import controlsimg from '../../assets/game/controls.png'

// var gameState = require('./GameState');

class ControlPrompt {
  constructor(canvas, context) {
    this.ctx = context;
    this.cvs = canvas;

    this.sX = 0;
    this.sY = 0;
    this.w = 196;
    this.h = 111;
    this.x = 580;
    this.y = 8;

    this.controls = new Image();
    this.controls.src = controlsimg;
  }

  draw(state) {
    this.ctx.drawImage(this.controls, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
  }

  update(state) {

  }

  reset() {

  }

}

export default ControlPrompt;