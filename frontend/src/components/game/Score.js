
const GAME_STATE = require('./GameState');

class Score {
  constructor(canvas, context){
      this.sY = 0;
      this.sX = 0;
      this.w = 137;
      this.h = 82;
      this.x = 25;
      this.y = 50;
      this.score = 0;
      this.obstacleScore = 0;
      this.frameTicks = 0;
      this.ctx = context;
      this.cvs = canvas;
  }

  update(state) {
    if (!state.isOver) {
      this.frameTicks++;
      this.obstacleScore = state.passedObstacles * 500;
      if (state.gameState === GAME_STATE.RUNNING){
        if (this.frameTicks % 5 === 0) {
          // Gives player 100 points for each 100 frames
          // console.log(`Add 100 points`);
          this.score += 1;
        }
      }
    }
  }

  reset() {
    this.score = 0;
  }

  draw(state) {
    if (state.gameState !== GAME_STATE.READY) {
      this.ctx.fillText("Game score: " + this.score, this.x, this.y);
      // this.ctx.drawImage(over, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    }
    else {
      // this.ctx.fillText("Game score: " + this.score, this.x, this.y);
    }
  }

  addObstacleScore(score) {
    this.score += score;
  }

}

export default Score;