const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function executePythonCode(code) {
  const tempFilePath = path.join(__dirname, 'temp.py');
  fs.writeFileSync(tempFilePath, code);

  const pythonProcess = spawnSync('python', [tempFilePath]);

  const output = pythonProcess.stdout.toString();
  const error = pythonProcess.stderr.toString();

  fs.unlinkSync(tempFilePath);

  if (error) {
    console.error('Python Error:', error);
    return null;
  }

  return output;
}

function executePythonScript(scriptPath, args = []) {
  const pythonProcess = spawnSync('python', [scriptPath, ...args]);

  const output = pythonProcess.stdout.toString();
  const error = pythonProcess.stderr.toString();

  if (error) {
    console.error('Python Error:', error);
    return null;
  }

  return output;
}

module.exports = {
  executePythonCode,
  executePythonScript
};
