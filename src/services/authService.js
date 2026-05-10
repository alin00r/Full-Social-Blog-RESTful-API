const crypto = require('crypto');

const User = require('../models/userModel');
const Group = require('../models/groupModel');
const AppError = require('../utils/appError');
const sendEmail = require('../middlewares/emailMiddleware');

const registerUser = async ({ name, email, password, passwordConfirm }) => {
  if (password !== passwordConfirm) {
    throw new AppError('Passwords do not match', 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  const user = new User({ name, email, password });
  await user.save();
  await new sendEmail(user).sendWelcome();
  // Auto-add new user to the default group if it exists
  try {
    const DEFAULT_GROUP_ID = process.env.DEFAULT_GROUP_ID;
    const group = await Group.findById(DEFAULT_GROUP_ID);
    if (group) {
      const userIdStr = user._id.toString();
      const isMember = group.members?.some((id) => id.toString() === userIdStr);
      if (!isMember) {
        group.members = group.members || [];
        group.members.push(user._id);
        // ensure basic read permission for new member
        group.memberPermissions = group.memberPermissions || [];
        const existing = group.memberPermissions.find(
          (item) => item.user.toString() === userIdStr,
        );
        if (!existing)
          group.memberPermissions.push({
            user: user._id,
            permissions: ['read', 'write'],
          });
        await group.save();
      }
    }
  } catch (err) {
    // don't block registration on group update failures
    console.error('Failed to add new user to default group:', err);
  }
  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  return user;
};

const logout = async (res) => {
  res
    .clearCookie('jwt')
    .status(200)
    .json({ status: 'success', message: 'Logout Successful' });
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(`there is no user from this ${email}`, 404);
  }

  const resetCode = await user.createPasswordResetToken();
  const hashResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');
  user.passwordResetCode = hashResetCode;
  user.passwordResetExpires = Date.now() + 20 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();
  try {
    await new sendEmail(user, resetCode).sendPasswordReset();
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    throw new AppError(
      `There is an error in sending email , Please Try Again Later`,
      400,
    );
  }
};

const verifyCode = async (resetCode) => {
  const hashResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset code', 400);
  }

  user.passwordResetVerified = true;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(`There is no user with email ${email}`, 404);
  }
  if (!user.passwordResetVerified) {
    throw new AppError('Reset code not verified', 400);
  }
  user.password = newPassword;
  user.passwordChangedAt = Date.now();
  user.passwordResetVerified = undefined;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  await new sendEmail(user).sendPasswordchanged();
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  verifyCode,
  resetPassword,
};
