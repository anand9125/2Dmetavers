import { WebSocketServer } from 'ws';
import { User } from './User';

const wss = new WebSocketServer({ port: 3001 });  // new WebSocket server is created and listens on port 3001 for incoming connections.

wss.on('connection', function connection(ws) { //  when a new client connects to the server for then sets a event listener .
  let user = new User(ws);
  ws.on('error', console.error);
  ws.on('close', function close() {
    if (user) {
      user.destroy();
    }
  });
});