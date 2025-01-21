import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3001 });  // new WebSocket server is created and listens on port 3001 for incoming connections.

wss.on('connection', function connection(ws) { //  when a new client connects to the server for then sets a event listener .
  ws.on('error', console.error);
 
  ws.on('message', function message(data) {//this listens for messages from the client. When a message is received
    console.log('received: %s', data);
  });

  ws.send('something');  //sends a message  to the client immediately after the connection is established.
});