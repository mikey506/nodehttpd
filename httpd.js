const http = require('http');
const url = require('url');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const hostname = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
  const { method, url: reqUrl, headers } = req;
  const { pathname } = url.parse(reqUrl);

  console.log(`Request received - Method: ${method}, URL: ${pathname}, IP: ${req.connection.remoteAddress}, Timestamp: ${new Date().toLocaleString()}`);

  if (method === 'GET') {
    if (pathname === '/') {
      const filePath = path.join(__dirname, 'public', 'index.html');
      serveStaticFile(filePath, res);
    } else {
      const filePath = path.join(__dirname, 'public', pathname);
      serveStaticFile(filePath, res);
    }
  } else if (method === 'POST') {
    if (pathname === '/execute') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        let postData;
        try {
          postData = JSON.parse(body);
        } catch (error) {
          console.error('Invalid JSON payload:', error);
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('400 Bad Request');
          return;
        }

        const codeBlock = postData.code;

        // Execute the Python script using the code block as a command
        exec(`python3 -c "${codeBlock.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
          if (error) {
            console.error('Python script execution error:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
          } else {
            console.log('Python script execution result:', stdout);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(stdout);
          }
        });
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('405 Method Not Allowed');
  }
});

function serveStaticFile(filePath, res) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      res.end(content);
    }
  });
}

function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    default:
      return 'text/plain';
  }
}

server.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});
