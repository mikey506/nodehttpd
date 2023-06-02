# HTTPD Server

The HTTPD Server is a lightweight web server that supports Python script execution. It allows you to run Python scripts on the server and receive the execution results via HTTP requests.

## Prerequisites

Before setting up and running the HTTPD server, ensure that you have the following prerequisites installed:

- Node.js v20.2.0 or higher
- Python 3.x

## Setup Instructions

1. Clone the repository:

git clone https://github.com/example/httpd-server.git

2. Navigate to the project directory:

cd httpd-server

3. Install dependencies:

npm install

4. Start the server:

node httpd.js


The server will be running at `http://localhost:8000`.

## HTTPD Server Functionality

The HTTPD Server provides the following functionality:

- **Static File Serving**: The server can serve static HTML, CSS, JavaScript, and other files located in the `public` directory.

- **Python Script Execution**: You can send a POST request to `/execute` with a Python script in the request body. The server will execute the script and return the output.

**Warning**: Executing arbitrary Python code on the server can be a security risk. Make sure to validate and sanitize any user input to prevent code injection and other vulnerabilities.

## Example Usage

To execute a Python script using the HTTPD Server:

1. Send a POST request to `http://localhost:8000/execute` with the following JSON body:

json formate
{
  "script": "print('Hello, world!')"
}

2. Return:

HTTP/1.1 200 OK
Content-Type: text/plain

Hello, world!

