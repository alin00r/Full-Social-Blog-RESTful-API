const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  profileImg: Joi.string().optional(),
  profileImgId: Joi.string().optional(),
  role: Joi.string().valid('user', 'admin').optional(),
});

const changeUserPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  profileImg: Joi.string().optional(),
  role: Joi.string().valid('user', 'admin').optional(),
  profileImgId: Joi.string().optional(),
});

const getUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
const deleteUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const updateLoggedUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  profileImg: Joi.string().optional(),
});

module.exports = {
  createUserSchema,
  changeUserPasswordSchema,
  updateUserSchema,
  updateLoggedUserSchema,
  getUserSchema,
  deleteUserSchema,
};
