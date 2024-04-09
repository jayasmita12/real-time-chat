require('dotenv').config()
const http = require("http")
const express = require("express")
const {Server} = require("socket.io")

const app = express();
const server = http.createServer(app)
const io = new Server(server)

//app root file(index.html) connected
app.use(express.static("../public"))
app.get("/" , (req , res)=>{
    return res.sendFile("../public/index.html")
})

let users = {}

//socket connected
io.on('connection', (socket) => {
    socket.on("new-user-joined" , (name)=>{
        users[socket.id]=name;
        io.emit("user-joined" , name)
    });
    socket.on('chat-message-from-you', (msg) => {  
        socket.broadcast.emit("message-to-all" , {message:msg , name:users[socket.id]})
    });
    socket.on('disconnect', (msg) => {  
        socket.broadcast.emit("user-left" , users[socket.id])
        delete users[socket.id]
    });
});

const PORT =process.env.PORT || 9340

//server listen on port number
server.listen(PORT , ()=> console.log(`Server started in the port ${PORT}`))
