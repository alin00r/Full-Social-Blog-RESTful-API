const joi = require('joi');
const JoiObjectId = require('joi-objectid')(joi);

const postImageSchema = joi.object({
  url: joi.string().uri().required().messages({
    'string.base': 'Image URL must be a string',
    'string.uri': 'Image URL must be a valid URI',
    'any.required': 'Image URL is required',
  }),
  id: joi.string().required().messages({
    'string.base': 'Image ID must be a string',
    'string.empty': 'Image ID is required',
    'any.required': 'Image ID is required',
  }),
});

const postImagesSchema = joi
  .array()
  .items(postImageSchema)
  .empty('')
  .optional();

const postValidationSchema = joi.object({
  title: joi.string().required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  content: joi.string().required().messages({
    'string.base': 'Content must be a string',
    'string.empty': 'Content is required',
    'any.required': 'Content is required',
  }),
  author: joi.string().required().messages({
    'string.base': 'Author must be a string',
    'string.empty': 'Author is required',
    'any.required': 'Author is required',
  }),
  group: JoiObjectId().optional().allow('').messages({
    'string.base': 'Group must be a string',
    'string.hex': 'Group must be a valid ObjectId',
    'string.length': 'Group must be 24 characters long',
  }),
  images: postImagesSchema,
});

const createPostSchema = postValidationSchema;

const updatePostSchema = postValidationSchema.keys({
  author: joi.string().optional(),
  title: joi.string().optional(),
  content: joi.string().optional(),
  group: JoiObjectId().optional().allow(''),
  images: postImagesSchema,
});

const deletePostSchema = joi.object({
  id: joi.string().required().messages({
    'string.base': 'Post ID must be a string',
    'string.empty': 'Post ID is required',
    'any.required': 'Post ID is required',
  }),
});

const getPostByIdSchema = joi.object({
  id: JoiObjectId().required().messages({
    'string.base': 'Post ID must be a string',
    'string.empty': 'Post ID is required',
    'any.required': 'Post ID is required',
  }),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
  getPostByIdSchema,
};
