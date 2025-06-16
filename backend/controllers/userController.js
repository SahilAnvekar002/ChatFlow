// import modules, models and middlewares
const User = require('../models/User');
const Chat = require('../models/Chat');

// search users by query api
exports.searchUsers = async (req, res) => {
  const query = req.query.query;

  if (!query) return res.status(400).json({ status: 'error', payload: 'Query required' });

  try {
    const users = await User.find({
      username: { $regex: query, $options: 'i' }, // case-insensitive
      _id: { $ne: req.user._id }
    }).select('_id username email profilePic');

    res.status(200).json({ status: 'success', payload: users });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};

// send chat request api 
exports.sendRequest = async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.id;

  if (senderId.toString() === receiverId)
    return res.status(400).json({ status: 'error', payload: 'Cannot send request to self' });

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver)
      return res.status(404).json({ status: 'error', payload: 'User not found' });

    if (receiver.requests.includes(senderId) || receiver.friends.includes(senderId))
      return res.status(400).json({ status: 'error', payload: 'Already requested or friends' });

    receiver.requests.push(senderId); // push user id to receivers reqeusts
    sender.sentRequests.push(receiverId); // push receiver id to users sent reqeusts

    await receiver.save();
    await sender.save();

    const requestedUser = await User.findById(receiverId).select("username email");

    res.status(200).json({ status: 'success', payload: requestedUser });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};

// accept chat request
exports.acceptRequest = async (req, res) => {
  const senderId = req.params.id;
  const receiverId = req.user._id;

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver)
      return res.status(404).json({ status: 'error', payload: 'User not found' });

    if (!receiver.requests.includes(senderId))
      return res.status(400).json({ status: 'error', payload: 'Request not found' });

    receiver.requests = receiver.requests.filter(id => id.toString() !== senderId); // remove user id from receivers requets
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId.toString()); // remove receiver id from users sent requets

    if (!receiver.friends.includes(senderId)) receiver.friends.push(senderId); 
    if (!sender.friends.includes(receiverId)) sender.friends.push(receiverId);

    await receiver.save();
    await sender.save();

    const acceptedUser = await User.findById(senderId).select("username email");

    // fetch chat between users if already exist
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [senderId, receiverId] }
    });

    if (chat) return res.status(200).json({ status: 'success', payload: { acceptedUser } });

    // if chat does not exist, create new chat 
    const newChat = await Chat.create({
      isGroupChat: false,
      users: [senderId, receiverId],
    });

    const fullChat = await Chat.findById(newChat._id)
      .populate('users', '-password') // show chat user ids as user except password 
      .populate('groupAdmin', '-password') // show chat admin id as user except password
      .populate('latestMessage') // show message id as message
      .sort({ updatedAt: -1 }); // sort chat as per latest

    const result = await User.populate(fullChat, {
      path: 'latestMessage.sender',
      select: 'username email',
    });

    res.status(200).json({ status: 'success', payload: {acceptedUser, result} });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};

// decline chat request
exports.declineRequest = async (req, res) => {
  const senderId = req.params.id;
  const receiverId = req.user._id;

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver)
      return res.status(404).json({ status: 'error', payload: 'User not found' });

    if (!receiver.requests.includes(senderId))
      return res.status(400).json({ status: 'error', payload: 'Request not found' });

    receiver.requests = receiver.requests.filter(id => id.toString() !== senderId); // remove user id from receivers requets
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId.toString()); // remove receiver id from user sent requets

    await receiver.save();
    await sender.save();

    const declinedUser = await User.findById(senderId).select("username email");

    res.status(200).json({ status: 'success', payload: declinedUser });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};

// fetch user data api
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ status: 'error', payload: 'User not found' });

    res.status(200).json({ status: 'success', payload: user });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};

// fetch user requests api
exports.getRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('requests', 'username email profilePic');
    res.status(200).json({ status: 'success', payload: user.requests });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};

// fetch user sent requests api
exports.getSentRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('sentRequests', 'username email profilePic');
    res.status(200).json({ status: 'success', payload: user.sentRequests });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};

// fetch user friends api
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'username email profilePic');
    res.status(200).json({ status: 'success', payload: user.friends });
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal Server error' });
  }
};

// remove friend api
exports.removeFriend = async (req, res) => {
  const friendId = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend)
      return res.status(404).json({ status: 'error', payload: 'User not found' });

    user.friends = user.friends.filter(id => id.toString() !== friendId); // remove friend id from user friends
    friend.friends = friend.friends.filter(id => id.toString() !== userId.toString()); // remove user id from friend friends

    await user.save();
    await friend.save();

    const removedFriend = await User.findById(friendId).select("username email");

    res.status(200).json({ status: 'success', payload:  removedFriend});
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal server error' });
  }
};

// upload profile pic api
exports.uploadProfilePic = async (req, res) => {
  const userId = req.user._id;
  const {profilePic} = req.body;

  try {

    await User.findByIdAndUpdate(userId, {profilePic});
    const user = await User.findById(userId).select('-password');

    res.status(200).json({ status: 'success', payload:  user});
  } catch (err) {
    res.status(500).json({ status: 'error', payload: 'Internal server error' });
  }
};