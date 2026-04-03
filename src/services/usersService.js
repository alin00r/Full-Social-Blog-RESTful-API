const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { uploadToImageKit, deleteFromImageKit } = require('../utils/imageKit');

//@desc  Update user profile image
//@route PUT /api/v1/users/profile-image
//@access Private
const updateProfileImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  if (req.user.profileImgId) {
    await deleteFromImageKit(req.user.profileImgId);
  }

  const imageResult = await uploadToImageKit(
    req.file.buffer,
    `users/${req.user._id}/profile-${Date.now()}`,
    'Users/Profile',
  );

  req.body.profileImg = imageResult.url;
  req.body.profileImgId = imageResult.fileId;

  next();
};

//@desc  Update specific User
//@route PUT /api/v1/users/:id
//@access Private admin only
const updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      profileImg: req.body.profileImg,
      profileImgId: req.body.profileImgId,
      role: req.body.role,
    },
    {
      new: true,
    },
  );

  if (!user) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  return user;
};

// @desc  Change specific User password
// @route PUT /api/v1/users/:id/changePassword
// @access Private admin only
const changeUserPassword = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  if (!user) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  return user;
};

//@desc  Update Logged User Password
//@route PUT /api/v1/users/changeMyPassword
//@access Private/Protect
const updateLoggedUserPassword = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true },
  );

  if (!user) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  return user;
};
//@desc  Update Logged User data (without password,role)
//@route PUT /api/v1/users/updateMyData
//@access Private/Protect
const updateLoggedUserData = async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      profileImg: req.body.profileImg,
      profileImgId: req.body.profileImgId,
    },
    { new: true },
  );
  if (!updatedUser) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  return updatedUser;
};

//@desc  Delete logged user data (soft delete by setting active to false)
//@route DELETE /api/v1/users/deleteMe
//@access Private/Protect
const deleteLoggedUserData = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  // Delete user profile image from ImageKit if exists
  if (req.user.profileImgId) {
    await deleteUserImage(req.user._id, req.user.profileImgId);
  }
};

//@desc  Activate logged user account
//@route PATCH /api/v1/users/activeMe
//@access Public
const activeLoggedUserData = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !user.active === false) {
    res.status(204).send();
  }
  user.active = true;
  await user.save();
  next();
};

const deleteUserImage = async (userId, imageId) => {
  await deleteFromImageKit(imageId);
  await User.findByIdAndUpdate(userId, {
    profileImg: null,
    profileImgId: null,
  });
};

module.exports = {
  updateUser,
  changeUserPassword,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  activeLoggedUserData,
  updateProfileImage,
};
