const catchAsync = require('../utils/catchAsync');
const Post = require('../models/postModel');
const factory = require('../services/handlersFactory');
const postServices = require('../services/postService');
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');

// Upload multiple Images
exports.uploadPostImages = uploadMixOfImages([
  { name: 'images', maxCount: 10 },
]);

exports.attachPostAuthor = (req, res, next) => {
  req.body = req.body || {};
  req.body.author = req.user.id;
  next();
};

exports.uploadPostImagesToImageKit = catchAsync(async (req, res, next) => {
  await postServices.uploadPostImagesToImageKit(req, res, next);
});
// @desc  Create a new post
// @route POST /api/v1/posts
// @access Private users
exports.createPost = catchAsync(async (req, res, next) => {
  const post = await postServices.createPost(req, res, next);
  res.status(201).json({ data: post });
});

// @desc  Get all posts of the logged-in user
// @route GET /api/v1/posts
// @access Private users
exports.getMyPosts = catchAsync(async (req, res, next) => {
  const posts = await postServices.getMyPosts(req, res, next);
  res.status(200).json({ data: posts });
});

// @desc  Get specific Post by id
// @route GET /api/v1/posts/:id
// @access Private users
exports.getPostById = factory.getOne(Post);

// @desc  Delete a post by id
// @route DELETE /api/v1/posts/:id
// @access Private users
exports.deleteMyPost = catchAsync(async (req, res, next) => {
  await postServices.deleteMyPost(req, res, next);
  res.status(204).json();
});

// @desc  Update a post by id
// @route PATCH /api/v1/posts/:id
// @access Private users
exports.updateMyPost = catchAsync(async (req, res, next) => {
  const post = await postServices.updateMyPost(req, res, next);
  res.status(200).json({ data: post });
});
// @desc  Get all posts for feed
// @route GET /api/v1/posts/feed
// @access Public
exports.getFeed = catchAsync(async (req, res, next) => {
  const posts = await postServices.getFeed(req, res, next);
  res.status(200).json({ data: posts });
});

// @desc  Get all posts in a specific group
// @route GET /api/v1/groups/:groupId/posts
// @access Private
exports.getGroupPosts = catchAsync(async (req, res, next) => {
  const posts = await postServices.getGroupPosts(req, res, next);
  res.status(200).json({ results: posts.length, data: posts });
});

// @desc  Get specific post in a specific group
// @route GET /api/v1/groups/:groupId/posts/:postId
// @access Private
exports.getPostByGroup = catchAsync(async (req, res, next) => {
  const post = await postServices.getPostByGroup(req, res, next);
  res.status(200).json({ data: post });
});
// Admin controllers
exports.getAllPosts = factory.getAll(Post, 'Posts');
exports.createPostByAdmin = factory.createOne(Post);
exports.getPostByIdAdmin = factory.getOne(Post);
exports.updatePostByAdmin = factory.updateOne(Post);
exports.deletePostByAdmin = factory.deleteOne(Post);
