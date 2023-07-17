const express = require('express'); 
const app = express(); 
const server = require('http').Server(app); 
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer'); 
const PORT = process.env.PORT || 3000; 

const peerServer = ExpressPeerServer(server, {
    debug: true
});


app.use(express.static('./assets'));
app.set('view engine', 'ejs'); 
app.set('views', './views');
app.use('/', require('./routes/index'));



io.on('connection', socket => {
   
    socket.on('join-room', (roomId, userId, userName) => {
        socket.join(roomId); 
        socket.broadcast.to(roomId).emit('user-connected', userId, userName);
        socket.on('send-message', (inputMsg, userName) => {
            io.to(roomId).emit('recieve-message', inputMsg, userName);
        })
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId, userName);
        })
    });
});

//running the server
server.listen(PORT, function (err) {
    if (err) {
        console.log(`Error :: ${err} occured while starting the server in index.js!`);
    }
    console.log(`Server is up and running on port ${PORT}`);
});