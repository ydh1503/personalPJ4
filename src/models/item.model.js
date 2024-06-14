const items = {};

// 아이템 초기화
export const createItem = (uuid) => {
  items[uuid] = [];
};

export const getItem = (uuid) => {
  return items[uuid];
};

export const setItem = (uuid, id, score, stageId) => {
  return items[uuid].push({ id, score, stageId });
};

export const clearItem = (uuid) => {
  items[uuid] = [];
};

export const getItemsScore = (uuid) => {
  let score = items[uuid].reduce((acc, cur) => acc + cur.score, 0);

  return score;
};

export const getStageItemsScore = (uuid, stageId) => {
  let score = items[uuid].reduce((acc, cur) => {
    if (cur.stageId === stageId) return acc + cur.score;
    return acc;
  }, 0);

  return score;
};
