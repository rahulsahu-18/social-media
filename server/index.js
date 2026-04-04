import express, { urlencoded } from "express"
import dotenv from "dotenv";
import { connectdb } from "./src/utils/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/userRoutes.js";
import postRouter from "./src/routes/postRoutes.js";
import msgRouter from "./src/routes/messageRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use('/api/v1/user',userRouter);
app.use('/api/v1/post',postRouter);
app.use('/api/v1/chat',msgRouter);

const port = process.env.PORT
app.listen(port,()=>{
    connectdb();
    console.log(`SERVER RUNNING ON ${process.env.PORT}`)
})