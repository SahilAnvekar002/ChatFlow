// import modules, models and middlewares
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// register user api
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ status: 'error', payload: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, email, password: hashedPassword });

        res.status(201).json({
            status: 'success',
            payload: {
                _id: user._id,
                name: user.username,
                email: user.email,
                token: generateToken(user._id),
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', payload: 'Internal Server Error' });
    }
};

// login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ status: 'error', payload: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ status: 'error', payload: 'Invalid credentials' });

        res.json({
            status: 'success',
            payload: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', payload: 'Internal Server Error' });
    }
};