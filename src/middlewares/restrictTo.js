const AppError = require('../utils/appError');

const restrictTo = (...roles) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role)) {
      return next(new AppError('forbidden', 403));
    }
    next();
  };
};

module.exports = restrictTo;
