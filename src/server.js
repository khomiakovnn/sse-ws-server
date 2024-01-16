const WebSocket = require('ws');
const http = require('http');

let clients = [];
let usersOnline = []
const messages = [];

function sendAll() {
  const message = JSON.stringify([usersOnline, messages])
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('WebSocket server is running!\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log(`Client connected from IP ${ws._socket.remoteAddress} and port ${ws._socket.remotePort}`);
  clients.push(ws);
  let standingUser = '';
  sendAll();

  ws.on('message', (message) => {
    console.log(`Received message from client at port ${ws._socket.remotePort}: ${message}`);
    const receivedData = JSON.parse(message);

    switch (receivedData[0]) {
        case 'new user':
          standingUser = receivedData[1]
          usersOnline.push(standingUser);
          break;
        case 'new message':
          messages.push(receivedData[1]);
          break;
    }
    sendAll();
  });

  ws.on('close', () => {
    console.log(`Client from IP ${ws._socket.remoteAddress} and port ${ws._socket.remotePort} disconnected`);
    clients = clients.filter(item => item !== ws);
    usersOnline = usersOnline.filter(item => item !== standingUser);
    sendAll();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
