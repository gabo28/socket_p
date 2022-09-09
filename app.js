const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const fs = require('fs');

const app = express();

app.use(express.static('public'))

const httpServer = createServer(app);


const io = new Server(httpServer, {});

io.on("connection", (socket) => {
    console.log(`El cliente ${socket.id} se ha CONECTADO`);

    socket.on('client:sendData', (data) => {
        fs.writeFile('datos.txt', data.cuenta + ',' + data.saldo + '\n', { flag: 'a' }, (err) => {
            socket.emit('server:sendData', { error: false, mensaje: 'La cuenta '+data.cuenta+' se ha guardado de manera exitosa!!!' })
            if (err) {
                socket.emit('server:sendData', { error: true, mensaje: 'No se pudo guardar la cuenta '+data.cuenta })
            }
        });
    })


    socket.on('client:findData', (mensaje) => {
        console.log(mensaje);
        fs.readFile('datos.txt', 'utf8', (err, file) => {
            const datos = file.split('\n')
                .map(x => ({ "cuenta": x.slice(0, x.indexOf(',')), "saldo": x.slice(x.indexOf(',') + 1) }))
                .filter(x => x.cuenta == mensaje.cuenta)
            let respuesta = { error: true, data:[] }
            if (datos.length > 0) {
                respuesta.error = false
                respuesta.data = datos[0]
            }
            socket.emit('server:findData', respuesta)
        })
    })


    socket.on('disconnect', function () {
        console.log(`El cliente ${socket.id} se ha DESCONECTADO`);
    });
});




httpServer.listen(3000);