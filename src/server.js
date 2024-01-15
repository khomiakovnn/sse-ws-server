const WebSocket = require('ws');
const http = require('http');

// Создаем HTTP-сервер
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('WebSocket server is running!\n');
});

// Создаем WebSocket-сервер на основе HTTP-сервера
const wss = new WebSocket.Server({ server });

// Обработчик подключения нового клиента
wss.on('connection', (ws) => {
  console.log(`Client connected from IP ${ws._socket.remoteAddress} and port ${ws._socket.remotePort}`);

  // Обработчик сообщений от клиента
  ws.on('message', (message) => {
    console.log(`Received message from client at port ${ws._socket.remotePort}: ${message}`);
    ws.send(`Server received your message: ${message}`);

    // Отправляем сообщение обратно клиенту
    ws.send(`Server received your message: ${message}`);
  });

  // Обработчик закрытия соединения
  ws.on('close', () => {
    console.log(`Client at port ${ws._socket.remotePort} disconnected`);
  });
});

// Запускаем сервер на порту 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
