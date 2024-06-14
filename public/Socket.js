import { CLIENT_VERSION } from './Constants.js';
import { getGameAssets } from './assets.js';

const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
let currentStage;
socket.on('response', (data) => {
  console.log(data);
  if (data.currentStage) currentStage = data.currentStage;
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
  const assests = getGameAssets();
  currentStage = assests.stages.data[0].id;
});

const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { sendEvent, currentStage };
