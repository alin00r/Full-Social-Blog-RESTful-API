const Group = require('../models/groupModel');
const AppError = require('../utils/appError');
const { uploadToImageKit, deleteFromImageKit } = require('../utils/imageKit');

// Helper function to check if user can access the group
const addGroupImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const imageResult = await uploadToImageKit(
    req.file.buffer,
    `Groups/profile-${Date.now()}`,
    'Groups/Profile',
  );
  console.log(imageResult);
  req.body.groupImg = imageResult.url;
  req.body.groupImgId = imageResult.fileId;

  next();
};

// Helper function to check if user can manage the group
const canManageGroup = (group, user) => {
  if (!group || !user) {
    return false;
  }

  if (user.role === 'super-admin') {
    return true;
  }

  return group.createdBy?.toString() === user._id.toString();
};
// Helper function to check if user can create posts in the group
const canCreatePostInGroup = (group, user) => {
  if (!group || !user) {
    return false;
  }

  if (user.role === 'super-admin') {
    return true;
  }

  if (group.createdBy?.toString() === user._id.toString()) {
    return true;
  }

  if (
    group.admins?.some((adminId) => adminId.toString() === user._id.toString())
  ) {
    return true;
  }

  const memberPermission = group.memberPermissions?.find(
    (item) => item.user.toString() === user._id.toString(),
  );

  return memberPermission?.permissions?.includes('write') || false;
};

// @desc  Create new group
// @route POST /api/v1/groups
// @access Private
const createGroup = async (req, res, next) => {
  const newGroup = await Group.create({
    title: req.body.title,
    description: req.body.description,
    groupImg: req.body.groupImg,
    groupImgId: req.body.groupImgId,
    createdBy: req.user._id,
    admins: [req.user._id],
    members: [req.user._id],
    memberPermissions: [
      { user: req.user._id, permissions: ['read', 'write', 'delete'] },
    ],
  });
  newGroup.save();
  return newGroup;
};

// @desc  Add user to group
// @route POST /api/v1/groups/:groupId/users
// @access Private
const addUserToGroup = async (req, res, next) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  const group = await Group.findById(groupId);
  if (!group) {
    return next(new AppError(`No group found with id ${groupId}`, 404));
  }
  if (!canManageGroup(group, req.user)) {
    return next(new AppError(`You are not allowed to manage this group`, 403));
  }
  if (group.members.includes(userId)) {
    return next(new AppError(`User is already a member of this group`, 400));
  }
  group.members.push(userId);

  const existingPermission = group.memberPermissions.find(
    (item) => item.user.toString() === userId,
  );

  if (!existingPermission) {
    group.memberPermissions.push({ user: userId, permissions: ['read'] });
  }

  await group.save();
  return group;
};

// @desc  Remove user from group
// @route DELETE /api/v1/groups/:groupId/users/:userId
// @access Private
const removeUserFromGroup = async (req, res, next) => {
  const { groupId, userId } = req.params;
  const group = await Group.findById(groupId);
  if (!group) {
    return next(new AppError(`No group found with id ${groupId}`, 404));
  }
  if (!canManageGroup(group, req.user)) {
    return next(new AppError(`You are not allowed to manage this group`, 403));
  }
  if (!group.members.includes(userId)) {
    return next(new AppError(`User is not a member of this group`, 400));
  }
  group.members = group.members.filter((id) => id.toString() !== userId);
  group.memberPermissions = group.memberPermissions.filter(
    (item) => item.user.toString() !== userId,
  );
  await group.save();
  return group;
};

// @desc  Manage user permissions in group
// @route PUT /api/v1/groups/:groupId/permissions
// @access Private
const managePermissions = async (req, res, next) => {
  const { groupId } = req.params;
  const { userId, permissions } = req.body;
  const group = await Group.findById(groupId);
  if (!group) {
    return next(new AppError(`No group found with id ${groupId}`, 404));
  }
  if (!canManageGroup(group, req.user)) {
    return next(new AppError(`You are not allowed to manage this group`, 403));
  }

  const isMember = group.members.some((id) => id.toString() === userId);
  if (!isMember) {
    return next(new AppError(`User is not a member of this group`, 400));
  }

  const target = group.memberPermissions.find(
    (item) => item.user.toString() === userId,
  );

  if (target) {
    target.permissions = permissions;
  } else {
    group.memberPermissions.push({ user: userId, permissions });
  }

  await group.save();
  return group;
};

module.exports = {
  createGroup,
  addUserToGroup,
  removeUserFromGroup,
  managePermissions,
  addGroupImage,
  canCreatePostInGroup,
};
