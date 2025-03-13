const express = require("express");
const path = require("path");
const readline = require("readline");
const net = require("net");

const app = express();
const PORT = 3000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask the user if they want to use localhost
function askForLocalhost() {
  rl.question("Use localhost? (yes/no): ", (answer) => {
    if (answer.toLowerCase() === 'yes') {
      startServer('localhost');
    } else if (answer.toLowerCase() === 'no') {
      askForIP();
    } else {
      console.log("Invalid input. Please enter 'yes' or 'no'.");
      askForLocalhost();
    }
  });
}

// Ask the user to enter an IP address
function askForIP() {
  rl.question("Enter IP address: ", (ip) => {
    if (validateIP(ip)) {
      checkIPAvailability(ip, (isAvailable) => {
        if (isAvailable) {
          startServer(ip);
        } else {
          console.log("IP address not available. Please try another one.");
          askForIP();
        }
      });
    } else {
      console.log("Invalid IP address. Please try again.");
      askForIP();
    }
  });
}

// Validate the IP address format
function validateIP(ip) {
  const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
}

// Check if the IP address is available
function checkIPAvailability(ip, callback) {
  const server = net.createServer();
  server.once('error', (err) => {
    if (err.code === 'EADDRNOTAVAIL') {
      callback(false);
    } else {
      callback(true);
    }
  });
  server.once('listening', () => {
    server.close();
    callback(true);
  });
  server.listen(PORT, ip);
}

// Start the server with the given IP address
function startServer(IP) {
  // Middleware для обслуживания статических файлов
  app.use(express.static(path.join(__dirname, "public")));

  // Запуск сервера
  app.listen(PORT, IP, () => {
    console.log(`Server running at http://${IP}:${PORT}/`);
  });

  rl.close();
}

// Start the process by asking for localhost
askForLocalhost();