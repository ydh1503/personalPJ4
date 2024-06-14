import { getGameAssets } from '../init/assets.js';
import { getItem, setItem } from '../models/item.model.js';
import { getStage } from '../models/stage.model.js';

export const getItemHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }
  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  const { items, itemUnlocks } = getGameAssets();
  const currentItems = [];

  currentStages.forEach((stage) => {
    const itemUnlock = itemUnlocks.data.find((data) => data.stage_id === stage.id);
    if (itemUnlock) {
      const { item_id } = itemUnlock;
      currentItems.push(item_id);
    }
  });
  if (!currentItems.includes(payload.itemId)) {
    return { status: 'fail', message: 'Item that cannot appear in current Stage' };
  }

  const { score } = items.data.find((item) => item.id === payload.itemId);
  if (score !== payload.itemScore) {
    return { status: 'fail', message: 'Item Score is Wrong' };
  }

  setItem(userId, payload.itemId, payload.itemScore, currentStage.id);

  console.log('Items: ', getItem(userId));

  return { status: 'success', message: 'Get Item' };
};
