/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only management endpoints
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     description: Super-admin only.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         example: 10
 *         description: Number of items per page.
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *         example: -createdAt
 *         description: Sort by field. Prefix with - for descending order.
 *       - in: query
 *         name: fields
 *         required: false
 *         schema:
 *           type: string
 *         example: title,description
 *         description: Comma-separated fields to include.
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *         example: frontend
 *         description: Search keyword used against group title.
 *     responses:
 *       200:
 *         description: Groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                 paginationResult:
 *                   $ref: '#/components/schemas/PaginationResult'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Group'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
