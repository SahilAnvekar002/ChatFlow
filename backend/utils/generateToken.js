// import module
const jwt = require('jsonwebtoken');

// generate jwt token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '5d',
  });
};

module.exports = generateToken;