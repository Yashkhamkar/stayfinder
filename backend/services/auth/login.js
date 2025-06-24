const ErrorResponse = require('../../utils/error/ErrorResponse');
const User = require('../../models/User');
const { generateToken } = require('../../utils/jwt/generateToken');

const loginService = async ({ email, password }) => {
  try{
  if (!email || !password) {
    throw new ErrorResponse('Please provide email and password', 400);
  }

  const user = await User.findByEmail(email);
  if (!user || user.password !== password) {
    throw new ErrorResponse('Invalid credentials', 401);
  }

  const token = generateToken(user._id);
  return { user: { id: user._id, name: user.name, email: user.email, isHost: user.isHost }, token };
  } catch (error) {
    throw new ErrorResponse(error.message || 'Server error', error.statusCode || 500);
  }
};

module.exports = loginService;