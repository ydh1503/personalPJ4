import { getGameAssets } from './assets.js';
import { currentStage, sendEvent } from './Socket.js';

const getStage = (stageId, n = 0) => {
  const { stages } = getGameAssets();
  const index = stages.data.findIndex((stage) => stage.id === stageId);

  if (index === -1 || stages.data.length - 1 < index + n) return null;
  return stages.data[index + n];
};

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  stage;
  nextStage;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    if (!this.stage || !this.nextStage) {
      this.stage = getStage(currentStage);
      this.nextStage = getStage(currentStage, 1);
    }
    if (!this.stageChange) {
      this.stage = getStage(currentStage);
      this.nextStage = getStage(currentStage, 1);
      this.stageChange = true;
    }

    //this.score += deltaTime * 0.001;
    this.score += deltaTime * 0.001 * this.stage.scorePerSecond;

    // // 점수가 100점 이상이 될 시 서버에 메세지 전송
    // if (Math.floor(this.score) === 100 && this.stageChange) {
    //   this.stageChange = false;
    //   sendEvent(11, { currentStage: 1000, targetStage: 1001 });
    // }

    if (this.nextStage && Math.floor(this.score) >= this.nextStage.score && this.stageChange) {
      this.stageChange = false;
      sendEvent(11, { currentStage: this.stage.id, targetStage: this.nextStage.id });
    }
  }

  getItem(itemId) {
    const { items } = getGameAssets();
    const item = items.data.find((item) => item.id === itemId);
    this.score += item.score;
    sendEvent(12, { itemId, itemScore: item.score });
  }

  reset() {
    this.score = 0;
    this.stageChange = true;
    this.stage = null;
    this.nextStage = null;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
