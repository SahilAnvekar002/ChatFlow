import { io } from 'socket.io-client';

const ENDPOINT = 'https://chatflow-backend-dhtx.onrender.com';
const socket = io(ENDPOINT, { transports : ["websocket"] });

export default socket;
