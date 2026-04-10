import express, { urlencoded } from "express"
import cors from 'cors'
import dotenv from "dotenv";
import { connectdb } from "./src/utils/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/userRoutes.js";
import postRouter from "./src/routes/postRoutes.js";
import msgRouter from "./src/routes/messageRoutes.js";
import http from "http";
import { initSocket } from "./src/socket/socket.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.URL,
    credentials: true,
};
app.use(cors(corsOptions));
app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/message', msgRouter);

const port = process.env.PORT;
const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);
server.listen(port, () => {
    connectdb();
    console.log(`SERVER RUNNING ON ${process.env.PORT}`);
});