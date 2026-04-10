import express from 'express'
import upload from '../middleware/multer.js';
import {isAuth} from '../middleware/isAuth.js'
import { addComment, addPost, bookMarkPost, deletePost, dislikePost, getAllPosts, getCommentsOfPost, getUsersPost, likePost } from '../controllers/postController.js';
const postRouter = express.Router();

postRouter.post('/add-post',isAuth,upload.single('image'),addPost);
postRouter.get('/userpost/all',isAuth,getUsersPost);
postRouter.get('/like/:id',isAuth,likePost);
postRouter.get('/all',isAuth,getAllPosts)
postRouter.get('/dislike/:id',isAuth,dislikePost);
postRouter.post('/add-comment/:id',isAuth,addComment);
postRouter.get('/getPost-comment/:id',isAuth,getCommentsOfPost);
postRouter.delete('/delete-post/:id',isAuth,deletePost);
postRouter.get('/bookmark/:id',isAuth,bookMarkPost);

export default postRouter;