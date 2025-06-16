// import modules, models and middlewares
const Chat = require('../models/Chat');
const User = require('../models/User');

// open/create chat and fetch messages api
exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId)
    return res.status(400).json({ status: 'error', payload: 'UserId param missing' });

  try {
    // find chat which contains user id
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] }
    })
      .populate('users', '-password') // show user id as user except password field
      .populate('latestMessage'); // show message id as message

    chat = await User.populate(chat, {
      path: 'latestMessage.sender', // show user id as user
      select: 'username email', // with only username and email
    });

    if (chat) return res.status(200).json({ status: 'success', payload: chat });

    // create new chat if does not exist
    const newChat = await Chat.create({
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate('users', '-password');

    res.status(201).json({ status: 'success', payload: fullChat });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server Error' });
  }
};

// fetch all user chats api
exports.fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate('users', '-password') // show user id as user except password field
      .populate('groupAdmin', '-password') // show user id as user except password field
      .populate('latestMessage') // show message id as message
      .sort({ updatedAt: -1 }); // sort as per latest first

    const result = await User.populate(chats, {
      path: 'latestMessage.sender', // show user id as user
      select: 'username email', // with only username and email
    });

    res.status(200).json({ status: 'success', payload: result });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server Error' });
  }
};

// create new group chat
exports.createGroupChat = async (req, res) => {
  const { users, chatName } = req.body; 

  if (!users || !chatName) {
    return res.status(400).json({ status: 'error', payload: 'All fields are required' });
  }

  let groupUsers = Array.isArray(users) ? users : JSON.parse(users);

  if (groupUsers.length < 2) {
    return res.status(400).json({
      status: 'error',
      payload: 'A group chat requires at least 3 members including the creator',
    });
  }

  groupUsers.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName,
      users: groupUsers,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate('users', 'username email') // show user id as user with only username and email
      .populate('groupAdmin', 'username email'); // show user id as user with only username and email

    res.status(201).json({ status: 'success', payload: fullGroupChat });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server Error' });
  }
};

// add new member to group chat api
exports.addToGroup = async (req, res) => {
  const { chatId, users } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat.isGroupChat) {
      return res.status(400).json({ status: 'error', payload: 'Not a group chat' });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'error', payload: 'Only admin can add members' });
    }

    const existingUsers = chat.users.map(u => u.toString());
    const newUsers = users.filter(id => !existingUsers.includes(id));

    if (newUsers.length === 0) {
      return res.status(400).json({ status: 'error', payload: 'Users already in group' });
    }

    chat.users.push(...newUsers);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('users', 'username email') // show user id as user with only username and email
      .populate('groupAdmin', 'username email'); // show user id as user with only username and email

    res.status(200).json({ status: 'success', payload: updatedChat });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};

// remove member from group chat api
exports.removeFromGroup = async (req, res) => {
  const { chatId, users } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat.isGroupChat) {
      return res.status(400).json({ status: 'error', payload: 'Not a group chat' });
    }

    const existingUsers = chat.users.map(u => u.toString());
    const removeUsers = users.filter(id => existingUsers.includes(id));

    if (removeUsers.length === 0) {
      return res.status(400).json({ status: 'error', payload: 'Users not in group' });
    }

    const isAdmin = chat.groupAdmin.toString() === req.user._id.toString();
    const isRemovingSelf =  removeUsers.includes(req.user._id.toString()); 

    if (!isAdmin && isRemovingSelf) {
      return res.status(403).json({ status: 'error', payload: 'Only admin can remove others' });
    }

    chat.removedUsers.push(...removeUsers);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('users', 'username email') // show user id as user with only username and email
      .populate('groupAdmin', 'username email'); // show user id as user with only username and email

    res.status(200).json({ status: 'success', payload: updatedChat });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};

// delete group chat api
exports.deleteGroupChat = async (req, res) => {
  const chatId = req.params.id;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat || !chat.isGroupChat) {
      return res.status(404).json({ status: 'error', payload: 'Group chat not found' });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'error', payload: 'Only the group admin can delete the group chat' });
    }

    await Chat.findByIdAndUpdate(chatId, {isDeleted : true});
    const groupChat = await Chat.findById(chatId);

    res.status(200).json({ status: 'success', payload: groupChat });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};