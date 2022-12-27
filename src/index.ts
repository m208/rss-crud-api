import dotenv from 'dotenv';
import http from 'http';

dotenv.config();
const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: 'Hello World!'
    }));
  });

server.listen(PORT);
console.log(`Server started on port: ${PORT}`);


