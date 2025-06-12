// import modules, models and middlewares
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

// send new message api
exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ status: 'error', payload: 'Missing fields' });
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'username email'); // show user id as user with username and email
    message = await message.populate('chat'); // show chat id as chat
    message = await User.populate(message, {
      path: 'chat.users', // show user id as user 
      select: 'username email', // with username and email
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(200).json({ status: 'success', payload: message });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: 'Failed to send message' });
  }
};

// fetch chat messages api
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {

    const chat = await Chat.findById(chatId)
      .populate('users', '-password') // show user id as user except password
      .populate('groupAdmin', '-password'); // show user id as user except password

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username email'); // show user id as user with username and email

    res.status(200).json({ status: 'success', payload: { chat, messages } });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: 'Failed to get messages' });
  }
};

// delete message api
exports.deleteMessage = async (req, res) => {
  const messageId = req.params.messageId;
  const userId = req.user._id;

  try {
    const message = await Message.findByIdAndDelete(messageId)
      .populate({
        path: 'chat', // show chat id as chat
        populate: { path: 'users', select: '_id username email' } // show chat user ids as users with _id username and email
      });

    if (!message)
      return res.status(404).json({ status: 'error', payload: 'Message not found' });

    if (message.sender.toString() !== userId.toString())
      return res.status(403).json({ status: 'error', payload: 'Not authorized to delete this message' });

    const chatId = message.chat._id;

    const chat = await Chat.findById(chatId);
    let latestMessage = null; // initial latest message

    // Check if deleted message is latest message, update latest message
    if (chat.latestMessage?.toString() === messageId.toString()) {
      latestMessage = await Message.findOne({ chat: chatId })
        .sort({ createdAt: -1 }) // find new latest messgae after deletion
        .populate('sender', 'username email') // show user id as user with email and username
        .populate({
          path: 'chat', // show chat id as chat
          populate: {
            path: 'users', // show chat user ids as users
            select: 'username email', // with email and username
          }
        });

      chat.latestMessage = latestMessage?._id || null; // if latest message exits set it or set as null
      await chat.save();

      if(!latestMessage){
        latestMessage = {
          chat:{
            _id : chatId
          }
        }
      }
    }

    res.status(200).json({ status: 'success', payload: { deletedMessage: message, latestMessage: latestMessage } });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server Error' });
  }
};