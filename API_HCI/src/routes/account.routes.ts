import { Router } from "express";
import {
    getAccount,
    rechargeAccountBalance,
    updateAccountAlias,
    verifyAccountAlias,
    verifyAccountCvu
} from "../controllers/account.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/account:
 *  get:
 *      security:
 *         - bearerAuth: []
 *      summary: Get account 
 *      tags: [Account]
 *      operationId: getAccount
 *      produces:
 *         - application/json
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/AccountData'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.get("", authenticate, getAccount);

/**
 * @swagger
 * /api/account/recharge:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Recharge account balance
 *      tags: [Account]
 *      operationId: rechargeAccountBalance
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: amount
 *           required: true
 *           schema:
 *             - type: number
 *           description: Amount to recharge
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/AccountData'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post("/recharge", authenticate, rechargeAccountBalance);

/**
 * @swagger
 * /api/account/update-alias:
 *  put:
 *      security:
 *         - bearerAuth: []
 *      summary: Update account alias 
 *      tags: [Account]
 *      operationId: updateAccountAlias
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: alias
 *           required: true
 *           schema:
 *             - type: string
 *           description: Account new alias
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/AccountData'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.put("/update-alias", authenticate, updateAccountAlias);

/**
 * @swagger
 * /api/account/verify-cvu:
 *  get:
 *      security:
 *         - bearerAuth: []
 *      summary: Verify account CVU 
 *      tags: [Account]
 *      operationId: verifyAccountCvu
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: cvu
 *           required: true
 *           schema:
 *             - type: string
 *           description: Account CVU
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/AccountUserData'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.get("/verify-cvu", authenticate, verifyAccountCvu);

/**
 * @swagger
 * /api/account/verify-alias:
 *  get:
 *      security:
 *         - bearerAuth: []
 *      summary: Verify account alias 
 *      tags: [Account]
 *      operationId: verifyAccountAlias
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: alias
 *           required: true
 *           schema:
 *             - type: string
 *           description: Account alias
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/AccountUserData'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.get("/verify-alias", authenticate, verifyAccountAlias);



export default router;