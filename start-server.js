const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 5500;
const SERVER_SCRIPT = path.join(__dirname, 'server.js');

// Function to check if server is already running
function checkServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}`, (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Function to start the server
async function startServer() {
  try {
    // Check if server is already running
    const isRunning = await checkServerRunning();
    
    if (isRunning) {
      console.log('Server is already running at http://localhost:5500');
      return true;
    }

    console.log('Starting server...');
    
    // Start the server as a detached process
    const serverProcess = spawn('node', [SERVER_SCRIPT], {
      detached: true,
      stdio: 'ignore'
    });

    // Detach the process so it continues running
    serverProcess.unref();

    // Wait a moment for the server to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify the server started successfully
    const serverStarted = await checkServerRunning();
    
    if (serverStarted) {
      console.log('Server started successfully at http://localhost:5500');
      return true;
    } else {
      console.error('Failed to start server');
      return false;
    }
    
  } catch (error) {
    console.error('Error starting server:', error);
    return false;
  }
}

// Export the function for use in other modules
module.exports = { startServer, checkServerRunning };

// If this script is run directly, start the server
if (require.main === module) {
  startServer();
}