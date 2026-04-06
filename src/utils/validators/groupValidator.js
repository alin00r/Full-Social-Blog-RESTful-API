const Joi = require('joi');
const JoiObjectId = require('joi-objectid')(joi);

const groupSchema = Joi.object({
  title: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Group title must be a string',
    'string.empty': 'Group title cannot be empty',
    'string.min': 'Group title must be at least 3 characters long',
    'string.max': 'Group title must be less than 50 characters long',
    'any.required': 'Group title is required',
  }),
  description: Joi.string().min(10).max(200).required().messages({
    'string.base': 'Group description must be a string',
    'string.empty': 'Group description cannot be empty',
    'string.min': 'Group description must be at least 10 characters long',
    'string.max': 'Group description must be less than 200 characters long',
    'any.required': 'Group description is required',
  }),
  groupPicture: Joi.string().optional(),
  groupPictureId: Joi.string().optional(),
  admins: Joi.array().items(JoiObjectId()).optional().messages({
    'string.hex': 'Admin ID must be a hexadecimal string',
    'string.length': 'Admin ID must be 24 characters long',
  }),
  members: Joi.array().items(JoiObjectId()).optional().messages({
    'string.hex': 'Member ID must be a hexadecimal string',
    'string.length': 'Member ID must be 24 characters long',
  }),
  memberPermissions: Joi.array()
    .items(
      Joi.object({
        user: JoiObjectId().required().messages({
          'string.hex': 'User ID must be a hexadecimal string',
          'string.length': 'User ID must be 24 characters long',
          'any.required': 'User ID is required',
        }),
        permissions: Joi.array()
          .items(
            Joi.string().valid('read', 'write', 'delete').messages({
              'string.base': 'Permission must be a string',
              'any.only': 'Permission must be one of read, write, or delete',
            }),
          )
          .required()
          .messages({
            'array.base': 'Permissions must be an array',
            'any.required': 'Permissions array is required',
          }),
      }),
    )
    .optional(),
});

const addUserToGroupSchema = groupSchema.keys({
  userId: JoiObjectId().required().messages({
    'string.hex': 'User ID must be a hexadecimal string',
    'string.length': 'User ID must be 24 characters long',
    'any.required': 'User ID is required',
  }),
});

const removeUserFromGroupSchema = addUserToGroupSchema;

const managePermissionsSchema = Joi.object({
  userId: JoiObjectId().required().messages({
    'string.hex': 'User ID must be a hexadecimal string',
    'string.length': 'User ID must be 24 characters long',
    'any.required': 'User ID is required',
  }),
  permissions: Joi.array()
    .items(
      Joi.string().valid('read', 'write', 'delete').messages({
        'string.base': 'Permission must be a string',
        'any.only': 'Permission must be one of read, write, or delete',
      }),
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Permissions must be an array',
      'array.min': 'At least one permission is required',
      'any.required': 'Permissions are required',
    }),
});

module.exports = {
  groupSchema,
  addUserToGroupSchema,
  removeUserFromGroupSchema,
  managePermissionsSchema,
};
