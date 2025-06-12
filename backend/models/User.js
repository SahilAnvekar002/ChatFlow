//User model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: '',
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  sentRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
