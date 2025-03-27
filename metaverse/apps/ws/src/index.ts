import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });  // new WebSocket server is created and listens on port 3001 for incoming connections.
