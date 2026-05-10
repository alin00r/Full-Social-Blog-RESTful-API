const catchAsync = require('../utils/catchAsync');
const Group = require('../models/groupModel');
const AppError = require('../utils/appError');
const factory = require('../services/handlersFactory');
const groupServices = require('../services/groupService');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

// Upload Single Image
exports.uploadGroupImage = uploadSingleImage('groupImg');

// Uplaod Image to ImageKit and update user document
exports.uploadGroupImageToImageKit = catchAsync(async (req, res, next) => {
  await groupServices.addGroupImage(req, res, next);
});

// @desc  Create new group
// @route POST /api/v1/groups
// @access Private
exports.createGroup = catchAsync(async (req, res, next) => {
  const group = await groupServices.createGroup(req, res, next);
  res.status(201).json({ data: group });
});

// @desc  Add user to group
// @route POST /api/v1/groups/:groupId/users
// @access Private
exports.addUserToGroup = catchAsync(async (req, res, next) => {
  const group = await groupServices.addUserToGroup(req, res, next);
  res.status(200).json({ data: group });
});

// @desc  Remove user from group
// @route DELETE /api/v1/groups/:groupId/users/:userId
// @access Private
exports.removeUserFromGroup = catchAsync(async (req, res, next) => {
  const group = await groupServices.removeUserFromGroup(req, res, next);
  res.status(200).json({ data: group });
});

// @desc  Manage user permissions in group
// @route PUT /api/v1/groups/:groupId/permissions
// @access Private
exports.managePermissions = catchAsync(async (req, res, next) => {
  const group = await groupServices.managePermissions(req, res, next);
  res.status(200).json({ data: group });
});

const canAccessGroup = (group, user) => {
  if (!group || !user) return false;
  if (user?.role === 'super-admin') return true;
  if (group.createdBy?.toString() === user?._id?.toString()) return true;
  if (group.members?.some((id) => id.toString() === user?._id?.toString()))
    return true;
  return false;
};
const canManageGroup = (group, user) =>
  user?.role === 'super-admin' ||
  group.createdBy?.toString() === user?._id?.toString();

// @desc  Update group
// @route PUT /api/v1/groups/:groupId
// @access Private
exports.updateGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(
      new AppError(`No group found with id ${req.params.groupId}`, 404),
    );
  }

  if (!canAccessGroup(group, req.user)) {
    return next(new AppError('You are not allowed to update this group', 403));
  }

  const allowedUpdates = {
    title: req.body.title,
    description: req.body.description,
    groupImg: req.body.groupImg,
    groupImgId: req.body.groupImgId,
  };

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] === undefined) {
      delete allowedUpdates[key];
    }
  });

  const updatedGroup = await Group.findByIdAndUpdate(
    req.params.groupId,
    allowedUpdates,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({ data: updatedGroup });
});
// @desc  Delete group
// @route DELETE /api/v1/groups/:groupId
// @access Private
exports.deleteGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(
      new AppError(`No group found with id ${req.params.groupId}`, 404),
    );
  }

  if (!canAccessGroup(group, req.user)) {
    return next(new AppError('You are not allowed to delete this group', 403));
  }

  await Group.findByIdAndDelete(req.params.groupId);
  res.status(204).send();
});
// @desc  Get group by id
// @route GET /api/v1/groups/:groupId
// @access Private
exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(
      new AppError(`No group found with id ${req.params.groupId}`, 404),
    );
  }
  if (!canAccessGroup(group, req.user)) {
    return next(new AppError('You are not allowed to view this group', 403));
  }

  res.status(200).json({ data: group });
});

// @desc  Get groups for authenticated user
// @route GET /api/v1/groups/my
// @access Private
exports.getMyGroups = catchAsync(async (req, res, next) => {
  const groups = await groupServices.getMyGroups(req.user._id);
  res.status(200).json({ data: groups });
});
// @desc  Get all groups
// @route GET /api/v1/groups
// @access Private
exports.getAllGroups = factory.getAll(Group, 'Groups');
