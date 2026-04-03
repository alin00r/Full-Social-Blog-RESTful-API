const AppError = require('../utils/appError');
const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema || typeof schema.validate !== 'function') {
      return next(
        new AppError('Invalid validation schema configuration.', 500),
      );
    }
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((err) =>
        err.message.replace(/"/g, ''),
      );
      const validationError = new AppError('Validation failed', 400);
      validationError.errors = errorMessages;
      return next(validationError);
    }
    next();
  };
};

module.exports = validateRequest;
