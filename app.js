const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const session = require("express-session");

const app = express();

app.use(express.static('public'))

const httpServer = createServer(app);


const io = new Server(httpServer, {});

io.on("connection", (socket) => {
    console.log(`El cliente ${socket.id} se ha CONECTADO`);
    
    socket.on('client:sendData', (data)=>{
        console.log(data);
    })

    socket.on('disconnect', function() {
        console.log(`El cliente ${socket.id} se ha DESCONECTADO`);
  
       
     });
});




httpServer.listen(3000);