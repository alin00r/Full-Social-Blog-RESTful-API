const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Application API',
      version: '1.0.0',
      description: 'REST API documentation for the Blog Application',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'JWT Authorization header using the Bearer scheme. Example: "Bearer <JWT token>"',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
          description:
            'JWT token in httpOnly cookie (automatically sent with requests)',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66123456789abcdef012345' },
            name: { type: 'string', example: 'Ali Nour' },
            email: {
              type: 'string',
              format: 'email',
              example: 'alymohameedaly@gmail.com',
            },
            role: { type: 'string', example: 'user' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'Validation error' },
          },
        },
      },
    },
  },
  apis: [path.join(process.cwd(), 'src/docs/swagger/*.swagger.{js,ts}')],
};

module.exports = swaggerJSDoc(options);
