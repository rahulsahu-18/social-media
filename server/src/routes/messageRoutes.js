import express from 'express'
import {isAuth} from '../middleware/isAuth.js'
import { getAllMessage, sendMessage } from '../controllers/messageController.js';
const msgRouter = express.Router();

msgRouter.post('/send/:id',isAuth,sendMessage);
msgRouter.get('/all/:id',isAuth,getAllMessage);

export default msgRouter;