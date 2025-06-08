import { io } from 'socket.io-client';
const socket = io('http://localhost:3000'); // Match server port
export default socket;