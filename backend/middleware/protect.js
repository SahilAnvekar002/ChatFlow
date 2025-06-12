// import modules and models
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// middleware to validate token 
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; // get token from auth
  if (!token) return res.status(401).json({ status: 'error', payload: 'Unauthorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // check if token is valid
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ status: 'error', payload: 'Token failed' });
  }
};

module.exports = protect;