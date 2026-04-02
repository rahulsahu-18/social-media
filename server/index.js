import express, { urlencoded } from "express"
import dotenv from "dotenv";
import { connectdb } from "./src/utils/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/userRoutes.js";
import postRouter from "./src/routes/postRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use('/api/v1/user',userRouter);
app.use('/api/v1/post',postRouter);

const port = process.env.PORT
app.listen(port,()=>{
    connectdb();
    console.log(`SERVER RUNNING ON ${process.env.PORT}`)
})