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
const protect = require('../middlewares/protectMiddlware');
const restrictTo = require('../middlewares/restrictTo');

router
  .route('/')
  .post(protect, uploadGroupImage, uploadGroupImageToImageKit, createGroup)
  .get(protect, restrictTo('super-admin'), getAllGroups);

router
  .route('/:groupId')
  .get(protect, getGroup)
  .put(protect, uploadGroupImage, uploadGroupImageToImageKit, updateGroup)
  .delete(protect, deleteGroup);

router.post(
  '/:groupId/image',
  protect,
  uploadGroupImage,
  uploadGroupImageToImageKit,
  updateGroup,
);

router.post('/:groupId/users', protect, addUserToGroup);
router.delete('/:groupId/users/:userId', protect, removeUserFromGroup);
router.put('/:groupId/permissions', protect, managePermissions);

module.exports = router;
