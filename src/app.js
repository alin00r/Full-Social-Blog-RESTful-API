const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const groupRoutes = require('./routes/groupRoutes');
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
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/swagger-assets', express.static(swaggerUiAsset.getAbsoluteFSPath()));
app.get('/swagger.json', (req, res) => {
  res.json(specs);
});
app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }),
);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/groups', groupRoutes);
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
