const express = require('express');

const authController = require('../controllers/authController');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyCodeSchema,
  resetPasswordSchema,
} = require('../utils/validators/authValidator');
const validateRequest = require('../middlewares/validatorMiddleware');

const router = new express.Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register,
);

router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post(
  '/forgotPassword',
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  '/verifyCode',
  validateRequest(verifyCodeSchema),
  authController.verifyCode,
);
router.patch(
  '/resetPassword',
  validateRequest(resetPasswordSchema),
  authController.resetPassword,
);
module.exports = router;
