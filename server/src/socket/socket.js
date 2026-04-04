import {Server} from "socket.io";
import express from 'express';
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:process.env.URL,
        methods:['GET','POST']
    }
})

const userSocketMap = {}; // user and his socketId

export const getReciverSocketId = (reciverId) => userSocketMap[reciverId];

io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId)
    {
        getReciverSocketId[userId] = socket.id;
    }
    io.emit('getOnlineUser',Object.keys(getReciverSocketId));

    socket.on('disconnect',()=>{
        if(userId)
        {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUser',Object.keys(getReciverSocketId));
    })
})

export {app,server,io};


