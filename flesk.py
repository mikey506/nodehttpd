from flask import Flask, jsonify, render_template
import psutil
import os

app = Flask(__name__)

@app.route('/systemInfo', methods=['GET'])
def system_info():
    cpu_usage = psutil.cpu_percent()
    memory_usage = psutil.virtual_memory().percent
    return jsonify({'cpuUsage': cpu_usage, 'memoryUsage': memory_usage})

@app.route('/executeScript', methods=['POST'])
def execute_script():
    # Add your script execution logic here
    # Retrieve the scriptPath and args from the request data
    script_path = request.json.get('scriptPath')
    args = request.json.get('args', [])
    # Execute the script and return the output
    # ...

@app.route('/scriptOutput', methods=['GET'])
def script_output():
    # Add your script output retrieval logic here
    # Retrieve and return the script output
    # ...

@app.route('/', methods=['GET'])
def index():
    server_port = os.environ.get('SERVER_PORT', '')
    server_public_root = os.environ.get('SERVER_PUBLIC_ROOT', '')
    server_absolute_path = os.environ.get('SERVER_ABSOLUTE_PATH', '')
    python_path = os.environ.get('PYTHON_PATH', '')
    script_root = os.environ.get('SCRIPT_ROOT', '')
    debug_info = 'Add your debugging information here'

    return render_template('index.html', serverPort=server_port, serverPublicRoot=server_public_root,
                           serverAbsolutePath=server_absolute_path, pythonPath=python_path,
                           scriptRoot=script_root, debugInfo=debug_info)

if __name__ == '__main__':
    app.run(debug=True)
