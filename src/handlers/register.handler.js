import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const registerHandler = (io) => {
  // io -> 유저 전체, socket -> 유저 하나
  io.on('connection', (socket) => {
    // 이벤트 처리

    const userUUID = uuidv4();
    addUser({ uuid: userUUID, socketId: socket.id });

    handleConnection(socket, userUUID);

    socket.on('event', (data) => handlerEvent(io, socket, data));
    // 접속해제 시 이벤트
    socket.on('disconnect', (socket) => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
