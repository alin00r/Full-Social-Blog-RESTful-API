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
        GroupMemberPermission: {
          type: 'object',
          properties: {
            user: {
              type: 'string',
              example: '66123456789abcdef012345',
            },
            permissions: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['read', 'write', 'delete'],
              },
              example: ['read', 'write'],
            },
          },
        },
        Group: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66123456789abcdef012777' },
            title: { type: 'string', example: 'Frontend Team' },
            description: {
              type: 'string',
              example: 'A group for frontend collaboration and discussions.',
            },
            groupImg: {
              type: 'string',
              nullable: true,
              example: 'https://ik.imagekit.io/demo/groups/group-1.jpg',
            },
            groupImgId: {
              type: 'string',
              nullable: true,
              example: 'group-1-image-id',
            },
            createdBy: {
              type: 'string',
              example: '66123456789abcdef012345',
            },
            admins: {
              type: 'array',
              items: { type: 'string' },
            },
            members: {
              type: 'array',
              items: { type: 'string' },
            },
            memberPermissions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/GroupMemberPermission',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        PaginationResult: {
          type: 'object',
          properties: {
            currntPage: {
              type: 'integer',
              example: 1,
            },
            limit: {
              type: 'integer',
              example: 10,
            },
            numberOfPages: {
              type: 'integer',
              example: 4,
            },
            next: {
              type: 'integer',
              nullable: true,
              example: 2,
            },
            prev: {
              type: 'integer',
              nullable: true,
              example: null,
            },
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
  apis: [path.join(process.cwd(), 'src/docs/swagger/**/*.swagger.{js,ts}')],
};

module.exports = swaggerJSDoc(options);
