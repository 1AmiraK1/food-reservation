const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'JWTTOKENSECRETKEY'

const createToken = (payload) => {
  return jwt.sign(payload, jwtSecret, {
  expiresIn: '1d',
  algorithm: 'HS256',
  issuer: 'food-reservation'
});
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = { createToken, verifyToken };
