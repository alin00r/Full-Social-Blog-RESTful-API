const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const factory = require('../services/handlersFactory');
const userServices = require('../services/usersService');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

// Upload Single Image
exports.uploadUserImage = uploadSingleImage('profileImg');

// Uplaod Image to ImageKit and update user document
exports.uploadUserImageToImageKit = catchAsync(async (req, res, next) => {
  await userServices.updateProfileImage(req, res, next);
});

// @desc  Get list of users
// @route GET /api/v1/users
// @access Private
exports.getUsers = factory.getAll(User);

// @desc  Get specific User by id
// @route GET /api/v1/users/:id
// @access Private
exports.getUser = factory.getOne(User);

// @desc  Create user
// @route POST /api/v1/users
// @access Private
exports.createUser = factory.createOne(User);

// @desc  Update specific User
// @route PUT /api/v1/users/:id
// @acess Private
exports.updateUser = catchAsync(async (req, res, next) => {
  const document = await userServices.updateUser(req, res, next);
  res.status(200).json({ data: document });
});

exports.changeUserPassword = catchAsync(async (req, res, next) => {
  const document = await userServices.changeUserPassword(req, res, next);
  res.status(200).json({ data: document });
});
// @desc  Delete specific User
// @route Delete /api/users/:id
// @acess Private/Protect
exports.deleteUser = factory.deleteOne(User);

// @desc  Get Logged User data
// @route GET /api/v1/users/getMe
// @access Private/Protect
exports.getLoggedUserData = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc  Update Logged User Password
// @route PUT /api/v1/users/changeMyPassword
// @access Private/Protect
exports.updateLoggedUserPassword = catchAsync(async (req, res, next) => {
  await userServices.updateLoggedUserPassword(req, res, next);
  res.status(200).json({
    status: 'Success',
    message: 'Password updated successfuly please login again',
  });
});

// @desc  Update Logged User data (without password,role)
// @route PUT /api/v1/users/updateMyData
// @access Private/Protect
exports.updateLoggedUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await userServices.updateLoggedUserData(req, res, next);
  // Generate Token
  res.status(200).json({
    status: 'Success',
    data: updatedUser,
  });
});

// @desc  Deactivate Logged User
// @route DELETE /api/v1/users/deleteMe
// @access Private/Protect
exports.deleteLoggedUserData = catchAsync(async (req, res, next) => {
  await userServices.deleteLoggedUserData(req, res, next);
  res.status(204).send();
});

// @desc  activate Logged User
// @route PUT /api/v1/users/activeMe
// @access Public
exports.activeLoggedUserData = catchAsync(async (req, res, next) => {
  await userServices.activeLoggedUserData(req, res, next);
  res.status(200).json({
    status: 'success',
    message: 'Your Account activated successfuly',
  });
});
