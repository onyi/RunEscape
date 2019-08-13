import gameover from '../../assets/game/game-over.png';
import gg from '../../assets/game/gg.mp3';

var GAME_STATE = require('./GameState');

class GameOver {
  constructor(canvas, context) {
    this.ctx = context;
    this.cvs = canvas;

    this.sX = 0;
    this.sY = 0;
    this.w = 137;
    this.h = 82;
    this.x = this.cvs.width / 2 - 137 / 2;
    this.y = 90;

    this.over = new Image();
    this.over.src = gameover;

    this.gameover_music = new Audio();
    this.gameover_music.src = gg;
  }

  draw(state) {
    // console.log(`gameState game state: ${state.gameState}; ${GAME_STATE.over}`);
    if (state.gameState === GAME_STATE.OVER) {
      this.ctx.drawImage(this.over, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    }
    if (state.isOver) {
      let alivePlayers = state.players.filter(player => player.alive ).length;
      if (alivePlayers > 0) {
        this.ctx.fillText("Game Over. Current player alive: " + alivePlayers, 25, this.y + 100);
      }
    }
  }

  update(state) {

  }

  reset() {
    this.gameover_music.currentTime = 0;
  }
}

export default GameOver;