const createSendTokenCookies = require('../utils/createTokenCookie');
const catchAsync = require('../utils/catchAsync');
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  verifyCode,
  resetPassword,
} = require('../services/authService');

/**
 * User registration
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
exports.register = catchAsync(async (req, res, next) => {
  const user = await registerUser(req.body);
  createSendTokenCookies(user, 201, res);
});

/**
 * User Login
 * @route POST /api/v1/auth/login
 * @desc Login an existing user
 * @access Public
 */
exports.login = catchAsync(async (req, res, next) => {
  const user = await loginUser(req.body);
  createSendTokenCookies(user, 200, res);
});

/**
 * User Logout
 * @route POST /api/v1/auth/logout
 * @desc Logout the current user
 * @access Public
 */
exports.logout = catchAsync(async (req, res, next) => {
  await logout(res);
});

/**
 * @desc   Forgot password
 * @route  POST /api/v1/auth/forgotPassword
 * @access Public
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  await forgotPassword(req.body);
  res.status(200).json({
    status: 'Success',
    message: 'Reset code sent to email',
  });
});

/**
 * @desc Verfiy code
 * @route POST /api/v1/auth/verifyCode
 * @access Public
 */
exports.verifyCode = catchAsync(async (req, res, next) => {
  await verifyCode(req.body.resetCode);
  res.status(200).json({
    status: 'Success',
    message: 'Code verified successfully',
  });
});

/**
 *  @desc   Reset password
 *  @route  POST /api/v1/auth/resetPassword
 *  @access Public
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await resetPassword(req.body.email, req.body.newPassword);
  createSendTokenCookies(user, 200, res);
});
