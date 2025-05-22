import { Router } from "express";
import {
    createUser,
    getUser,
    loginUser,
    logoutUser,
    changeUserPassword,
    resetUserPassword,
    resendUserVerification,
    verifyUser
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/user:
 *  post:
 *      security: []
 *      summary: Create user
 *      tags: [User]
 *      operationId: createUser
 *      produces:
 *         - application/json
 *      requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/NewUserData'
 *      responses:
 *          201:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/UserData'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post("", createUser);

/**
 * @swagger
 * /api/user/resend-verification:
 *  post:
 *      security: []
 *      summary: Resend user verification
 *      tags: [User]
 *      operationId: resendVerificationUser
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: email
 *           required: true
 *           schema:
 *             - type: string
 *           description: User email
 *      responses:
 *          200:
 *              description: Successful operation
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post("/resend-verification", resendUserVerification);

/**
 * @swagger
 * /api/user/verify:
 *  post:
 *      security: []
 *      summary: Verify user
 *      tags: [User]
 *      operationId: verifyUser
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: code
 *           required: true
 *           schema:
 *             - type: string
 *           description: Verification code
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/UserData'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post("/verify", verifyUser);

/**
 * @swagger
 * /api/user/login:
 *  post:
 *      security: []
 *      summary: Logs in user
 *      tags: [User]
 *      operationId: loginUser
 *      produces:
 *         - application/json
 *      requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/CredentialsData'
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/AuthenticationData'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/user/reset-password:
 *  post:
 *      security: []
 *      summary: Request user password reset
 *      tags: [User]
 *      operationId: resetPassword
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: email
 *           required: true
 *           schema:
 *             - type: string
 *           description: User email
 *      responses:
 *          200:
 *              description: Successful operation 
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post('/reset-password/', resetUserPassword);

/**
 * @swagger
 * /api/user/change-password:
 *  post:
 *      security: []
 *      summary: Change user password
 *      tags: [User]
 *      operationId: changePassword
 *      produces:
 *         - application/json
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/ChangePasswordData'
 *      responses:
 *          200:
 *              description: Successful operation
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post('/change-password', changeUserPassword);

/**
 * @swagger
 * /api/user/logout:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Logs out user 
 *      tags: [User]
 *      operationId: logoutUser
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: Optional payload (can be empty or omitted for logout)
 *        required: false
 *      responses:
 *        200:
 *          description: Successful operation
 *        400:
 *          $ref: '#/responses/BadRequest'
 *        401:
 *          $ref: '#/responses/Unauthorized'
 *        500:
 *          $ref: '#/responses/ServerError'
 */
router.post("/logout", authenticate, logoutUser);

/**
 * @swagger
 * /api/user:
 *  get:
 *      security:
 *        - bearerAuth: []
 *      summary: Get user
 *      tags: [User]
 *      operationId: getUser
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/UserData'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.get("", authenticate, getUser);

export default router;