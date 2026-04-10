import { Server } from "socket.io";

const userSocketMap = {};
export const getReciverSocketId = (reciverId) => userSocketMap[reciverId];

export function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap[userId] = socket.id;
        }
        io.emit("getOnlineUser", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            if (userId) {
                delete userSocketMap[userId];
            }
            io.emit("getOnlineUser", Object.keys(userSocketMap));
        });
    });

    return io;
}


