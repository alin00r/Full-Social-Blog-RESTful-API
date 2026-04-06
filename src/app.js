// Third-party packages
const dotenv = require('dotenv');

dotenv.config();

const path = require('path');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const ratelimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const express = require('express');
const swaggerUiAsset = require('swagger-ui-dist');
const swaggerUI = require('swagger-ui-express');
const sanitizeInput = require('./middlewares/sanitizeInputMiddleware');

// Local modules
const morgan = require('morgan');
const logger = require('./utils/logger');
const dbConnection = require('./config/db');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morganFormat =
  ':method :url :status :response-time ms - :res[content-length] ';
const specs = require('./docs/swagger/index');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const groupRoutes = require('./routes/groupRoutes');

// Connect with db
dbConnection();
// express app
const app = express();

// Enable other domains to access the app
const corsOptions = {
  origin: ['http://localhost:3000', 'https://social-blog-api.vercel.app/'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// trust proxy
app.set('trust proxy', 1);

// compress all responses
app.use(compression());

//Logger
if (process.env.NODE_ENV === 'production') {
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(' ')[0],
            url: message.split(' ')[1],
            status: message.split(' ')[2],
            responseTime: message.split(' ')[3],
            contentLength: message.split(' ')[5],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    }),
  );
}

// Middlewares
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true }));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode ${process.env.NODE_ENV}`);
}

// Cookie Parser
app.use(cookieParser());

// To apply data sanitization
app.use(sanitizeInput);

const limiter = ratelimit({
  windowMs: 60 * 60 * 1000, //1 hour
  max: 100,
  message:
    'Too many requests created from this IP, please try again after an hour',
});

// Apply the rate limitimg middleware to  all requests
app.use('/api/v1/auth', limiter);

// Middleware to protect against HTTP Parameter
// Pollution attacks
app.use(
  hpp({
    whitelist: [],
  }),
);

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
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Social Blog API',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
