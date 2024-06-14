import Item from './Item.js';
import { currentStage } from './Socket.js';
import { getGameAssets } from './assets.js';

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];
  stageId = currentStage;
  stageItems = [];

  constructor(ctx, itemImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    if (!this.stageItems.length) return;
    const index = this.getRandomNumber(0, this.stageItems.length - 1);
    const itemInfo = this.stageItems[index];
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);
  }

  update(gameSpeed, deltaTime) {
    if (this.stageId !== currentStage) {
      this.stageId = currentStage;
      const { itemUnlocks } = getGameAssets();
      const itemUnlock = itemUnlocks.data.find((itemUnlock) => {
        return itemUnlock.stage_id === currentStage;
      });
      if (itemUnlock) {
        for (const itemInfo of this.itemImages) {
          if (itemInfo.id === itemUnlock.item_id && !this.stageItems.includes(itemInfo))
            this.stageItems.push(itemInfo);
        }
      }
    }

    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
    this.stageItems = [];
    this.stageId = null;
  }
}

export default ItemController;
