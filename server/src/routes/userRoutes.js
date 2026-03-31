import express from 'express'
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from '../controllers/userController.js';
import {isAuth} from '../middleware/isAuth.js'

const userRouter = express.Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.get('/logout',logout);
userRouter.get('/getUser/:id',isAuth,getProfile);
userRouter.post('/profile/edit',isAuth,editProfile);
userRouter.post('/followorunfollow/:id',isAuth,followOrUnfollow);
userRouter.post('/getSuggest-user',isAuth,getSuggestedUsers);

export default userRouter;