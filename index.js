const express = require('express')
const app= express()
const http = require('http')
const server = http.createServer(app)

const { Server } = require('socket.io')
const io = new Server(server)



app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/index.html')
})

//emit means we are sending data
// om means we are listenting to data 


io.on('connection', (socket)=>{
    console.log("connected")
    io.emit('chat message', "User has connected");
    socket.on('chat message',(msg)=>{
        // console.log('message: ' + msg)
        io.emit('chat message', msg)
    })

    socket.on('room join', (room)=>{
        socket.join(room)
        socket.on('chat message',(msg)=>{
            // console.log('message: ' + msg)
            io.to(room).emit('chat message', msg)
        })

        // io.to(room).emit(msg)
    })

    // when a user disconnects
    socket.on('disconnect', () => {
        // console.log(`user ${socket.id} disconnected`);
        io.emit('chat message', "User has disconnected")
      });

})

server.listen(3000,()=>{
    console.log('listening on port 3000')
})