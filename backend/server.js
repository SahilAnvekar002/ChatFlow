// import modules
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRouter')
const userRoutes = require('./routes/userRouter')
const chatRoutes = require('./routes/chatRouter')
const messageRoutes = require('./routes/messageRouter')

// configure environment variables
dotenv.config();

// create app
const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Socket.IO functions
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('setup', (userData) => {
    socket.join(userData._id); // user logged in 
    socket.emit('connected'); // user connected
  });

  socket.on('join chat', (roomId) => {
    socket.join(roomId); // user joined a chat
    console.log(`User joined room: ${roomId}`);
  });

  //socket.on('typing', (roomId) => socket.in(roomId).emit('typing'));
  //socket.on('stop typing', (roomId) => socket.in(roomId).emit('stop typing'));

  socket.on('new message', (message) => {
    const chat = message.chat;
    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit('message received', message); // emit message received event for all receivers
    });
  });

  socket.on('delete message', (deletedMessage, latestMessage) => {
    const chat = deletedMessage.chat;
    if (!chat.users) return;

    chat.users.forEach((user) => {
      socket.in(user._id).emit('message deleted', deletedMessage, latestMessage);  // emit delete message event for all receivers
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));