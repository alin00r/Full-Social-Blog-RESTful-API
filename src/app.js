const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dbConnection = require('./config/db');
const swaggerUI = require('swagger-ui-express');
const swaggerUiAsset = require('swagger-ui-dist');
const specs = require('./docs/swagger/index');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// express app
const app = express();

// Connect with db
dbConnection();

// Middleware
app.use(express.json());

// Routes
app.use('/swagger-assets', express.static(swaggerUiAsset.getAbsoluteFSPath()));
app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }),
);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
