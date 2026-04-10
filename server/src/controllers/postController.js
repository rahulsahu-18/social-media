import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comments.model.js";
import { getReciverSocketId } from "../socket/socket.js";

export const addPost = async (req, res) => {
  const authorId = req.id;
  const image = req.file;
  const { caption } = req.body;
  try {
    if (!image) return res.status(400).json({ message: "Image required" });

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
    const cloudResponce = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponce.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUsersPost = async (req, res) => {
  const authorId = req.id;

  try {
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "profilePicture username",
      })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const likePost = async (req, res) => {
  const likeUserId = req.id;
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    await post.updateOne({ $addToSet: { likes: likeUserId } });
    await post.save();

    // socket for realtime notification

    const user = await User.findById(likeUserId).select(
      "username profilePicture",
    );
    const postOwnerId = post.author.toString();

    if (likeUserId != postOwnerId) {
      const notification = {
        type: "like",
        userId: likeUserId,
        userDetails: user,
        postId,
        message: "Your post was liked",
      };
      const postOwnerSocketId = getReciverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit('notification', notification);
    }

    return res.status(200).json({ message: "like added successfully" });
  } catch (error) {
    console.log(error)
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    await post.updateOne({ $pull: { likes: userId } });
    await post.save();
  } catch (error) {
    console.log(error)
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentUserId = req.id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });

    const comment = await Comment.create({
      text,
      author: commentUserId,
      post: postId,
    });
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture",
    );

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found for this post", success: false });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  const userId = req.id;
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (post.author.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(userId);
    user.posts = user.posts.filter((id) => id !== postId);
    await user.save();

    //delete comment

    await Comment.deleteMany({ post: postId });
    return res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookMarkPost = async (req, res) => {
  const userId = req.id;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    const user = await User.findById(userId);

    if (user.bookmarks.includes(post._id)) {
      //remove from bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: user._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
