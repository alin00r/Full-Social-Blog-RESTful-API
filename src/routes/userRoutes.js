const express = require('express');

const restrictTo = require('../middlewares/restrictTo');
const protect = require('../middlewares/protectMiddlware');

const {
  createUserSchema,
  changeUserPasswordSchema,
  updateUserSchema,
  deleteUserSchema,
  getUserSchema,
  updateLoggedUserSchema,
  activeLoggedUserSchema,
  changeLoggedUserPasswordSchema,
} = require('../utils/validators/userValidator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const {
  getUser,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  uploadUserImage,
  changeUserPassword,
  activeLoggedUserData,
  uploadUserImageToImageKit,
} = require('../controllers/userController');

const router = express.Router();

// @desc  Activate logged user account
// @route PATCH /api/v1/users/activeMe
// @access Public
router.patch(
  '/activeMe',
  validatorMiddleware(activeLoggedUserSchema),
  activeLoggedUserData,
);

// Protect all routes after this middleware
router.use(protect);

// @desc  Get logged user data
// @route GET /api/v1/users/getMe
// @access Private/Protect
router.get('/getMe', getLoggedUserData, getUser);

// @desc  Update logged user password
// @route PUT /api/v1/users/changeMyPassword
// @access Private/Protect
router.patch(
  '/changeMyPassword',
  validatorMiddleware(changeUserPasswordSchema),
  updateLoggedUserPassword,
);

// @desc  Update logged user data (without password,role)
// @route PUT /api/v1/users/updateMyData
// @access Private/Protect
router.patch(
  '/updateMe',
  uploadUserImage,
  uploadUserImageToImageKit,
  validatorMiddleware(updateLoggedUserSchema),
  updateLoggedUserData,
);

// @desc  Delete logged user data (soft delete by setting active to false)
// @route DELETE /api/v1/users/deleteMe
// @access Private/Protect
router.delete(
  '/deleteMe',
  validatorMiddleware(changeLoggedUserPasswordSchema),
  deleteLoggedUserData,
);

// Admin Routes
router
  .route('/')
  .get(restrictTo('super-admin', 'admin'), getUsers)
  .post(
    restrictTo('super-admin', 'admin'),
    uploadUserImage,
    uploadUserImageToImageKit,
    validatorMiddleware(createUserSchema),
    createUser,
  );

router
  .route('/:id')
  .get(
    restrictTo('super-admin', 'admin'),
    validatorMiddleware(getUserSchema),
    getUser,
  )
  .patch(
    restrictTo('super-admin', 'admin'),
    uploadUserImage,
    uploadUserImageToImageKit,
    validatorMiddleware(updateUserSchema),
    updateUser,
  )
  .delete(
    restrictTo('super-admin'),
    validatorMiddleware(deleteUserSchema),
    deleteUser,
  );

// @desc  Get list of users
// @route GET /api/v1/users
// @access Private/admin
router.patch(
  '/changePassword/:id',
  restrictTo('super-admin'),
  validatorMiddleware(changeUserPasswordSchema),
  changeUserPassword,
);
module.exports = router;
