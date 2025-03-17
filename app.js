const express = require("express");
const path = require("path");
const readline = require("readline");
const net = require("net");
const fs = require("fs");
const yaml = require("js-yaml");

const app = express();
const DEFAULT_PORT = 3000;
const CONFIG_FILE = "config.yaml";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load configuration from YAML file
function loadConfig() {
  try {
    const config = yaml.load(fs.readFileSync(CONFIG_FILE, "utf8"));
    return config;
  } catch (e) {
    console.log("Error loading config file:", e);
    return null;
  }
}

// Ask the user if they want to use localhost
function askForLocalhost() {
  rl.question("Use localhost? (yes/no): ", (answer) => {
    if (answer.toLowerCase() === 'yes') {
      askForPort('localhost');
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
          askForPort(ip);
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

// Ask the user to enter a port number
function askForPort(ip) {
  rl.question(`Enter port (default is ${DEFAULT_PORT}): `, (port) => {
    const portNumber = port ? parseInt(port, 10) : DEFAULT_PORT;
    if (validatePort(portNumber)) {
      startServer(ip, portNumber);
    } else {
      console.log("Invalid port number. Please try again.");
      askForPort(ip);
    }
  });
}

// Validate the IP address format
function validateIP(ip) {
  const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
}

// Validate the port number
function validatePort(port) {
  return Number.isInteger(port) && port > 0 && port <= 65535;
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
  server.listen(DEFAULT_PORT, ip);
}

// Start the server with the given IP address and port
function startServer(IP, port) {
  // Middleware для обслуживания статических файлов
  app.use(express.static(path.join(__dirname, "public")));

  // Запуск сервера
  app.listen(port, IP, () => {
    console.log(`Server running at http://${IP}:${port}/`);
  });

  rl.close();
}

// Check if the script should run interactively
const args = process.argv.slice(2);
const isInteractive = args.includes("--interactive") || args.includes("-i");

if (isInteractive) {
  askForLocalhost();
} else {
  const config = loadConfig();
  if (config) {
    startServer(config.ip, config.port);
  } else {
    askForLocalhost();
  }
}