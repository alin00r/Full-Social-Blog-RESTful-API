const Post = require('../models/postModel');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');
const factory = require('./handlersFactory');
const userServices = require('./usersService');
const { uploadToImageKit, deleteFromImageKit } = require('../utils/imageKit');

// @desc  Create a new post
// @route POST /api/v1/posts
// @access Private users
const createPost = async (req, res, next) => {
  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id,
    images: req.body.images || [],
    group: req.body?.group,
  });
  return post;
};

// @desc  Get all posts of the logged-in user
// @route GET /api/v1/posts
// @access Private users
const getMyPosts = async (req, res, next) => {
  const posts = await Post.find({ author: req.user.id });
  return posts;
};

// @desc  Get specific Post by id
// @route GET /api/v1/posts/:id
// @access Private users
const getPostById = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError(`No post found with id ${req.params.id}`, 404));
  }
  return post;
};
// @desc  Delete a post by id
// @route DELETE /api/v1/posts/:id
// @access Private users
const deleteMyPost = async (req, res, next) => {
  const post = await Post.findOneAndDelete({
    _id: req.params.id,
    author: req.user.id,
  });
  if (!post) {
    return next(new AppError(`No post found with id ${req.params.id}`, 404));
  }
  post.images.forEach((image) => deleteFromImageKit(image.id));
  return post;
};
// @desc  Update a post by id
// @route PATCH /api/v1/posts/:id
// @access Private users
const updateMyPost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post.author.toString() !== req.user.id) {
    return next(
      new AppError(`You are not authorized to update this post`, 403),
    );
  }
  if (!post) {
    return next(new AppError(`No post found with id ${req.params.id}`, 404));
  }
  if (req.body.images && req.body.images.length > 0) {
    const oldPost = await Post.findById(req.params.id);
    if (oldPost) {
      await Promise.allSettled(
        oldPost.images.map((image) => deleteFromImageKit(image.id)),
      );
    }
  }
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.images = req.body.images || post.images;
  post.group = req.body.group || post.group;
  return post;
};

const getFeed = async (req, res, next) => {
  // i want to return postes of admin at the top then the rest of the posts sorted by createdAt
  const posts = await Post.find()
    .populate('author', 'name role')
    .sort({ createdAt: -1 })
    .lean();
  const adminPosts = posts.filter((post) => post.author.role === 'admin');
  const otherPosts = posts.filter((post) => post.author.role !== 'admin');
  return [...adminPosts, ...otherPosts];
};
// Upload post images to ImageKit
const uploadPostImagesToImageKit = async (req, res, next) => {
  req.body = req.body || {};

  // Check if images are provided
  if (!req.files || !req.files.images || req.files.images.length === 0) {
    return next();
  }

  const uploadedImages = [];

  try {
    for (let i = 0; i < req.files.images.length; i++) {
      const file = req.files.images[i];

      const imageResult = await uploadToImageKit(
        file.buffer,
        `posts/post-${Date.now()}-${i}`,
        'Posts',
      );

      uploadedImages.push({ url: imageResult.url, id: imageResult.fileId });
    }

    req.body.images = uploadedImages;
    return next();
  } catch (error) {
    await Promise.allSettled(
      uploadedImages.map((image) => deleteFromImageKit(image.id)),
    );
    return next(error);
  }
};

module.exports = {
  createPost,
  getMyPosts,
  getPostById,
  deleteMyPost,
  updateMyPost,
  uploadPostImagesToImageKit,
  getFeed,
};
