const { exec } = require('child_process');
const express = require('express');
const app = express();
const port = 8001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/execute', (req, res) => {
  const codeBlock = req.body.code;
  let modifiedData = req.body.data;

  const pyRegex = /<\?py([\s\S]*?)\?>/g;
  let match;
  let command = '';

  while ((match = pyRegex.exec(codeBlock)) !== null) {
    command += match[1];
  }

  // Execute the Python script using the code block as a command
exec(`python3 -c "${codeBlock.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
  if (error) {
    console.error('Python script execution error:', error);
  } else {
    console.log('Python script execution result:', stdout);
    let modifiedData = postData.data; // Initialize modifiedData variable
    const match = modifiedData.match(/<\?py([\s\S]*?)\?>/);
    if (match && match[1]) {
      const replacement = stdout.trim();
      modifiedData = modifiedData.replace(match[0], replacement);
      console.log('Modified data:', modifiedData);
    }
  }
});
app.listen(port, () => {
  console.log(`PyFunc server is running on port ${port}`);
});
