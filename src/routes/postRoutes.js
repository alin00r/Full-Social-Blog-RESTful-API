const express = require('express');

const {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
  getPostByIdSchema,
} = require('../utils/validators/postValidator');

const {
  attachPostAuthor,
  uploadPostImages,
  uploadPostImagesToImageKit,
  createPost,
  getMyPosts,
  getPostById,
  updateMyPost,
  deleteMyPost,
  getAllPosts,
  getFeed,
  createPostByAdmin,
  getPostByIdAdmin,
  updatePostByAdmin,
  deletePostByAdmin,
} = require('../controllers/postController');
const validateRequest = require('../middlewares/validatorMiddleware');
const restrictTo = require('../middlewares/restrictTo');
const protect = require('../middlewares/protectMiddlware');

const router = new express.Router();

// Public route
router.get('/feed', getFeed);

router.use(protect);

// User routes
router.post(
  '/',
  uploadPostImages,
  uploadPostImagesToImageKit,
  attachPostAuthor,
  validateRequest(createPostSchema),
  createPost,
);
router.get('/', getMyPosts);
router.route('/:id').get(getPostById).patch(
  uploadPostImages,
  uploadPostImagesToImageKit,
  validateRequest(updatePostSchema),

  updateMyPost,
);
router.delete('/:id', validateRequest(deletePostSchema), deleteMyPost);

// Admin routes
router.use(restrictTo('super-admin', 'admin'));
router
  .route('/admin')
  .get(getAllPosts)
  .post(validateRequest(createPostSchema), createPostByAdmin);

router
  .route('/admin/:id')
  .get(validateRequest(getPostByIdSchema), getPostByIdAdmin)
  .patch(validateRequest(updatePostSchema), updatePostByAdmin)
  .delete(validateRequest(deletePostSchema), deletePostByAdmin);

module.exports = router;
