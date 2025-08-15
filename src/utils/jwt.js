// src/utils/jwt.js
const jwt = require('jsonwebtoken');

const signToken = (payload, opts = {}) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '12h',
    ...opts,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
