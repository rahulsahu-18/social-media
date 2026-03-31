import express from "express"
import dotenv from "dotenv";
import { connectdb } from "./src/utils/db.js";

dotenv.config();
const app = express();

app.get('/',(req,res)=>{
    return res.json({
        message:"get coming"
    })
})

const port = process.env.PORT
app.listen(port,()=>{
    connectdb();
    console.log(`SERVER RUNNING ON ${process.env.PORT}`)
})