# Blog Application API

###

Node.js REST API for blogging, user management, group collaboration, and Swagger documented endpoints.

## Technologies

<div>

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![MongoDB](https://img.shields.io/badge/mongodb-6DA55F?style=for-the-badge&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-ff0000?style=for-the-badge&logo=mongoose&logoColor=white)
![Joi](https://img.shields.io/badge/Joi-5A29E4?style=for-the-badge&logoColor=white) ![Multer](https://img.shields.io/badge/Multer-red?style=for-the-badge&logoColor=white) ![ImageKit](https://img.shields.io/badge/ImageKit-0A66C2?style=for-the-badge&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-00FF00?style=for-the-badge&logo=swagger&logoColor=white) ![Nodemailer](https://img.shields.io/badge/Nodemailer-D14836?style=for-the-badge&logo=gmail&logoColor=white) ![Pug](https://img.shields.io/badge/Pug-A86454?style=for-the-badge&logo=pug&logoColor=white) ![EJS](https://img.shields.io/badge/EJS-8A8A8A?style=for-the-badge&logo=ejs&logoColor=white)

</div>

## Key Features

- **Authentication and Authorization:** JWT-based sign up, login, logout, password reset, and role-based access control.
- **User Management:** Admin user creation, updates, deletion, profile updates, and account activation.
- **Post Management:** Create, update, delete, and browse posts, including public feed support.
- **Group Collaboration:** Create groups, manage members, assign permissions, and control access per member.
- **Group Posts:** Allow users to create posts in groups only when they have write access.
- **Pagination and Search:** List routes support page, limit, sort, fields, and keyword query controls.
- **Image Uploads:** Upload user, group, and post images with ImageKit integration.
- **Validation Layer:** Joi validation middleware keeps request payloads consistent and safe.
- **Swagger Docs:** Fully documented endpoints available through Swagger UI.

## Installation

1. **Clone the repository**

   ```bash
   git clone <your-repository-url>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root and add:

   ```properties
   PORT=3000

   DB_URI=your-mongodb-connection-string

   JWT_SECRET_KEY=your-jwt-secret
   JWT_EXPIRE_TIME=90d

   MAILER_APP_EMAIL=your-email@gmail.com
   MAILER_APP_PASSWORD=your-email-password

   IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
   IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
   IMAGEKIT_URL_ENDPOINT=your-imagekit-url-endpoint
   ```

4. **Run the project**

   ```bash
   npm run dev
   ```

## Routes

### Auth Routes

`@access Public`

| Route | Path                          | Description                       | Body                                           | Params |
| ----- | ----------------------------- | --------------------------------- | ---------------------------------------------- | ------ |
| POST  | `/api/v1/auth/register`       | Register a new user               | `name`, `email`, `password`, `passwordConfirm` | none   |
| POST  | `/api/v1/auth/login`          | Login an existing user            | `email`, `password`                            | none   |
| POST  | `/api/v1/auth/logout`         | Logout current user               | none                                           | none   |
| POST  | `/api/v1/auth/forgotPassword` | Send password reset code          | `email`                                        | none   |
| POST  | `/api/v1/auth/verifyCode`     | Verify reset code                 | `resetCode`                                    | none   |
| PATCH | `/api/v1/auth/resetPassword`  | Reset password after verification | `email`, `newPassword`                         | none   |

### Users Routes

`@access Public / Private / Admin`

| Route  | Path                               | Description                        | Body                                              | Params |
| ------ | ---------------------------------- | ---------------------------------- | ------------------------------------------------- | ------ |
| PATCH  | `/api/v1/users/activeMe`           | Activate a deactivated account     | `email`, `password`                               | none   |
| GET    | `/api/v1/users/getMe`              | Get current logged-in user profile | none                                              | none   |
| PATCH  | `/api/v1/users/changeMyPassword`   | Change current user password       | `newPassword`                                     | none   |
| PATCH  | `/api/v1/users/updateMe`           | Update current user profile        | `name`, `email`, `profileImg`                     | none   |
| DELETE | `/api/v1/users/deleteMe`           | Deactivate current user account    | none                                              | none   |
| GET    | `/api/v1/users`                    | Get all users                      | query params supported                            | none   |
| POST   | `/api/v1/users`                    | Create a new user                  | `name`, `email`, `password`, `role`, `profileImg` | none   |
| GET    | `/api/v1/users/:id`                | Get user by id                     | none                                              | `id`   |
| PATCH  | `/api/v1/users/:id`                | Update user by id                  | `name`, `email`, `role`, `profileImg`             | `id`   |
| DELETE | `/api/v1/users/:id`                | Delete user by id                  | none                                              | `id`   |
| PATCH  | `/api/v1/users/changePassword/:id` | Change a specific user password    | `newPassword`                                     | `id`   |

### Posts Routes

`@access Public / Private / Admin`

| Route  | Path                      | Description                          | Body                                            | Params |
| ------ | ------------------------- | ------------------------------------ | ----------------------------------------------- | ------ |
| GET    | `/api/v1/posts/feed`      | Get public posts feed                | none                                            | none   |
| POST   | `/api/v1/posts`           | Create a post for the logged-in user | `title`, `content`, `group`, `images`           | none   |
| GET    | `/api/v1/posts`           | Get all posts of the logged-in user  | query params supported                          | none   |
| GET    | `/api/v1/posts/:id`       | Get a specific post                  | none                                            | `id`   |
| PATCH  | `/api/v1/posts/:id`       | Update a post                        | `title`, `content`, `group`, `images`           | `id`   |
| DELETE | `/api/v1/posts/:id`       | Delete a post                        | none                                            | `id`   |
| GET    | `/api/v1/posts/admin`     | Get all posts as admin               | query params supported                          | none   |
| POST   | `/api/v1/posts/admin`     | Create post as admin                 | `title`, `content`, `author`, `group`, `images` | none   |
| GET    | `/api/v1/posts/admin/:id` | Get a post as admin                  | none                                            | `id`   |
| PATCH  | `/api/v1/posts/admin/:id` | Update a post as admin               | `title`, `content`, `author`, `group`, `images` | `id`   |
| DELETE | `/api/v1/posts/admin/:id` | Delete a post as admin               | none                                            | `id`   |

### Groups Routes

`@access Private / Admin`

| Route  | Path                                    | Description                     | Body                               | Params              |
| ------ | --------------------------------------- | ------------------------------- | ---------------------------------- | ------------------- |
| POST   | `/api/v1/groups`                        | Create a new group              | `title`, `description`, `groupImg` | none                |
| GET    | `/api/v1/groups`                        | Get all groups                  | query params supported             | none                |
| GET    | `/api/v1/groups/:groupId`               | Get group details               | none                               | `groupId`           |
| PUT    | `/api/v1/groups/:groupId`               | Update group data               | `title`, `description`, `groupImg` | `groupId`           |
| DELETE | `/api/v1/groups/:groupId`               | Delete a group                  | none                               | `groupId`           |
| POST   | `/api/v1/groups/:groupId/image`         | Update group image              | `groupImg`                         | `groupId`           |
| POST   | `/api/v1/groups/:groupId/users`         | Add a user to a group           | `userId`                           | `groupId`           |
| DELETE | `/api/v1/groups/:groupId/users/:userId` | Remove a user from a group      | none                               | `groupId`, `userId` |
| PUT    | `/api/v1/groups/:groupId/permissions`   | Update permissions for a member | `userId`, `permissions`            | `groupId`           |

## Request Flow

1. The client sends a request to one of the REST endpoints.
2. Authentication middleware checks the JWT token or cookie.
3. Authorization middleware verifies the role or ownership rules.
4. Validation middleware checks the request body against Joi schemas.
5. Upload middleware processes images and sends them to ImageKit.
6. The controller prepares the response and delegates to the service layer.
7. The service layer applies business logic and database operations.
8. The global error handler formats errors consistently.

## Models

### User

Contains account identity, role, activation state, password metadata, and profile image data.

### Post

Contains `title`, `content`, `author`, optional `group`, and uploaded `images`.

### Group

Contains `title`, `description`, image metadata, creator info, admins, members, and per-member permissions.

## API Documentation

Swagger UI is available when the application is running.

- Swagger JSON: `/swagger.json`
- Swagger UI: `/api-docs`

## Pagination, Sorting, and Search

List routes support:

- `page`
- `limit`
- `sort`
- `fields`
- `keyword`

Example:

```text
?page=1&limit=10&sort=-createdAt&fields=title,description&keyword=frontend
```

## Author

Ali Nour
