const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const fs = require('fs');

const app = express();

app.use(express.static('public'))

const httpServer = createServer(app);


httpServer.listen(3000);