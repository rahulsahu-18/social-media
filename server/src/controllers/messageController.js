import { Conversation } from "../models/converssionModel.js";
import { Message } from "../models/message.model.js";
import { getReciverSocketId } from "../socket/socket.js";

export const getAllMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const reciverId = req.params.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    }).populate("messages");

    if (!conversation)
      return res.status(200).json({ success: true, messages: [] });
    return res
      .status(200)
      .json({ success: true, messages: conversation?.messages });
  } catch (error) {
    console.log(error);
  }
};


export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage: message } = req.body;

    // Validation: message must not be empty
    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Message text is required." });
    }

    let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    if (newMessage) conversation.messages.push(newMessage._id);
    await conversation.save();
    await newMessage.save();

    // Emit socket event if io is available on req.app
    const reciverSocketId = getReciverSocketId(receiverId);
    const io = req.app && req.app.get ? req.app.get('io') : null;
    if (reciverSocketId && io) {
      io.to(reciverSocketId).emit('newMessage', newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage
    });
  } catch (error) {
    console.log(error);
  }
}