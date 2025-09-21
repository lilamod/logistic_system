const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

exports.register = async (req, res) => {
      const {username, email, password } = req.body;
    
      const hashed = await bcrypt.hash(password, 10);
  
      const user = await User.create({ email, password: hashed, name:username });
  
      res.status(201).json({ email: user.email});
  
    
  };
  

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user?.id || "objectId",}, process.env.JWT_SECRET);
  res.json({ token, });
};
