const jwt = require('jsonwebtoken');

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '1d',
  algorithm: 'HS256',
  issuer: 'food-reservation'
});
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createToken, verifyToken };
