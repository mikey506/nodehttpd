const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
  const { method, url } = req;

  console.log(`Request received - Method: ${method}, URL: ${url}, IP: ${req.connection.remoteAddress}, Timestamp: ${new Date().toLocaleString()}`);

  if (method === 'GET' && url === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  } else if (method === 'POST' && url === '/executeScript') {
    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk;
    });
    req.on('end', () => {
      console.log('Received POST request body:', requestBody);

      const { pURL, args } = JSON.parse(requestBody);
      const scriptPath = path.join(__dirname, 'scripts', pURL + '.py');

      exec(`python "${scriptPath}" ${args.join(' ')}`, (error, stdout, stderr) => {
        console.log('Python process started.');
        if (error) {
          console.error('Python script execution error:', error);
          res.statusCode = 500;
          res.end('Internal Server Error');
        } else {
          console.log('Python script execution completed successfully.');
          res.setHeader('Content-Type', 'text/plain');
          res.end(stdout);
        }
      });
    });
  } else if (method === 'GET' && url.endsWith('.py')) {
    const scriptPath = path.join(__dirname, 'scripts', url);
    fs.readFile(scriptPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.setHeader('Content-Type', 'text/plain');
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const port = 8000;
const publicRoot = './public';
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
