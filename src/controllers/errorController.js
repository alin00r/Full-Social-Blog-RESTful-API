const AppError = require('../utils/appError');
const multer = require('multer');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak for security
  } else {
    // 1 Log error
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large. Max 5MB allowed.', 413);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files. Max 20 files allowed.', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected field.', 400);
  }
  return new AppError('File upload failed.', 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const duplicatedField = Object.keys(err.keyValue || {})[0] || 'Field';
  const fieldName = duplicatedField === 'name' ? 'Username' : duplicatedField;
  const normalizedFieldName =
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  const message = `${normalizedFieldName} already in use`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid Input data. ${errors.join(' && ')}`;
  return new AppError(message, 400);
};

const handleJwtInvalidSignature = () =>
  new AppError('Invalid token, please login again...', 401);

const handleJwtExpiredError = () =>
  new AppError('Expired token, please login again...', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const getClientMessage = (appErr) => {
    if (Array.isArray(appErr.errors) && appErr.errors.length > 0) {
      return `Invalid Input data. ${appErr.errors.join(' && ')}`;
    }
    return appErr.message;
  };

  if (err instanceof AppError) {
    // Respond with the error message and status code
    return res.status(err.statusCode).json({
      status: err.status,
      isAuthenticated: err.isAuthenticated,
      message: getClientMessage(err),
    });
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, name: err.name, message: err.message };
    if (err instanceof multer.MulterError) {
      error = handleMulterError(err);
    }
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error._message == 'User validation failed') {
      error = handleValidationErrorDB(error);
    }
    if (error._message == 'Service validation failed') {
      error = handleValidationErrorDB(error);
    }
    if (error.name == 'User validation failed') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') error = handleJwtInvalidSignature();
    if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();
    return sendErrorProd(error, res);
  }
};
