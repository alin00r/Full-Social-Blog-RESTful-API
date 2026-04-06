const express = require('express');
const router = express.Router();

const {
  getAllGroups,
  getGroup,
  deleteGroup,
  updateGroup,
  createGroup,
  addUserToGroup,
  removeUserFromGroup,
  managePermissions,
  uploadGroupImage,
  uploadGroupImageToImageKit,
} = require('../controllers/groupController');
const {
  getGroupPosts,
  getPostByGroup,
} = require('../controllers/postController');
const protect = require('../middlewares/protectMiddlware');
const restrictTo = require('../middlewares/restrictTo');
const validateRequest = require('../middlewares/validatorMiddleware');
const {
  createGroupSchema,
  updateGroupSchema,
  addUserToGroupSchema,
  removeUserFromGroupSchema,
  managePermissionsSchema,
} = require('../utils/validators/groupValidator');

router
  .route('/')
  .post(
    protect,
    uploadGroupImage,
    uploadGroupImageToImageKit,
    validateRequest(createGroupSchema),
    createGroup,
  )
  .get(protect, restrictTo('super-admin'), getAllGroups);

router
  .route('/:groupId')
  .get(protect, getGroup)
  .put(
    protect,
    uploadGroupImage,
    uploadGroupImageToImageKit,
    validateRequest(updateGroupSchema),
    updateGroup,
  )
  .delete(protect, deleteGroup);

router.post(
  '/:groupId/image',
  protect,
  uploadGroupImage,
  uploadGroupImageToImageKit,
  validateRequest(updateGroupSchema),
  updateGroup,
);

router.post(
  '/:groupId/users',
  protect,
  validateRequest(addUserToGroupSchema),
  addUserToGroup,
);
router.delete(
  '/:groupId/users/:userId',
  protect,
  validateRequest(removeUserFromGroupSchema),
  removeUserFromGroup,
);
router.put(
  '/:groupId/permissions',
  protect,
  validateRequest(managePermissionsSchema),
  managePermissions,
);

// Get all posts in a group
router.get('/:groupId/posts', protect, getGroupPosts);

// Get specific post by group
router.get('/:groupId/posts/:postId', protect, getPostByGroup);

module.exports = router;
