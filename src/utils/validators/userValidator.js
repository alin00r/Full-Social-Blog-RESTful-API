const Joi = require('joi');

const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 30 characters long',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  profileImg: Joi.string().optional(),
  profileImgId: Joi.string().optional(),
  role: Joi.string().valid('user', 'admin').optional().messages({
    'string.valid': 'Role must be either user or admin',
  }),
});
const createUserSchema = userValidationSchema;

const changeUserPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
});

const updateUserSchema = userValidationSchema.keys({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  profileImg: Joi.string().optional(),
  role: Joi.string().valid('user', 'admin').optional(),
  profileImgId: Joi.string().optional(),
});

const getUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.base': 'User ID must be a string',
    'string.hex': 'User ID must be a hexadecimal string',
    'string.length': 'User ID must be 24 characters long',
    'any.required': 'User ID is required',
  }),
});

const deleteUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.base': 'User ID must be a string',
    'string.hex': 'User ID must be a hexadecimal string',
    'string.length': 'User ID must be 24 characters long',
    'any.required': 'User ID is required',
  }),
});

const updateLoggedUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 30 characters long',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email',
  }),
  profileImg: Joi.string().optional().messages({
    'string.base': 'Profile image must be a string',
  }),
  profileImgId: Joi.string().optional().messages({
    'string.base': 'Profile image ID must be a string',
  }),
});

const changeLoggedUserPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters long',
    'any.required': 'New password is required',
  }),
});

const activeLoggedUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
});

module.exports = {
  createUserSchema,
  changeUserPasswordSchema,
  updateUserSchema,
  updateLoggedUserSchema,
  getUserSchema,
  deleteUserSchema,
  changeLoggedUserPasswordSchema,
  activeLoggedUserSchema,
};
