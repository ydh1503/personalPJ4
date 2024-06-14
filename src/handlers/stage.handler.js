import { getGameAssets } from '../init/assets.js';
import { getStageItemsScore } from '../models/item.model.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  // 유저는 스테이지를 하나씩 올라갈 수 있다. (1스테이지 -> 2, 2 -> 3)
  // 유저는 일정 점수가 되면 다음 스테이지로 이동한다.

  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  // // 1스테이지에서 2스테이지로 넘어가는 가정
  // // 5 -> 임의로 정한 오차범위
  // if (elapsedTime < 100 || elapsedTime > 105) {
  //   return { status: 'fail' };
  // }
  const { stages } = getGameAssets();
  const { score: targetScore } = stages.data.find((stage) => stage.id === payload.targetStage);
  const { score: currentScore, scorePerSecond: currentScorePerSecond } = stages.data.find(
    (stage) => stage.id === payload.currentStage,
  );
  const neededTime =
    (targetScore - currentScore - getStageItemsScore(userId, payload.currentStage)) /
    currentScorePerSecond;

  if (elapsedTime < neededTime || elapsedTime > neededTime + currentScorePerSecond * 5) {
    return { status: 'fail' };
  }

  // targetStage에 대한 검증 <- 게임 에셋에 존재하는가?
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  setStage(userId, payload.targetStage, serverTime);

  console.log('Stage: ', getStage(userId));

  return { status: 'success', message: 'Move next Stage', currentStage: payload.targetStage };
};
