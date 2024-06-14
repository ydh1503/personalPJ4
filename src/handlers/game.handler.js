import { getGameAssets } from '../init/assets.js';
import { clearItem, getItemsScore } from '../models/item.model.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();

  clearStage(uuid);
  clearItem(uuid);
  // stages 배열에서 0번째 = 첫번째 스테이지
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('Stage: ', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  // 클라이언트는 게임 종료 시 타임스탬프와 총 점수
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;
  const { stages: assetStages } = getGameAssets();

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    //totalScore += stageDuration; // 1초당 1점
    totalScore += stageDuration * assetStages.data[index].scorePerSecond;
  });

  // 아이템 점수 합산
  totalScore += getItemsScore(uuid);

  // 점수와 타임스탬프 검증
  // 오차 범위 5
  console.log(score, 'total:', totalScore);
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // DB 저장한다고 가정 한다면
  // 저장
  // setResult(userId, score, timestamp)

  return { status: 'success', message: 'Game ended', score };
};
