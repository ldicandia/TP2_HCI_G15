import { Router } from "express";
import {
    getPayment,
    getPayments,
    pullPayment,
    pushPendingPayment,
    transfer
} from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/payment/pull:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Pull payment
 *      tags: [Payment]
 *      operationId: pullPayment
 *      produces:
 *         - application/json
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/NewPaymentData'
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/PendingPaymentData'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post('/pull', authenticate, pullPayment);

/**
 * @swagger
 * /api/payment/push:
 *  put:
 *      security:
 *        - bearerAuth: []
 *      summary: Push pending payment
 *      tags: [Payment]
 *      operationId: pushPendingPayment
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: uuid
 *           required: true
 *           schema:
 *             - type: string
 *           description: Payment uuid
  *         - in: query
 *           name: cardId
 *           required: false
 *           schema:
 *             - type: string
 *           description: Card identifier
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/PendingPaymentData'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          422:
 *              $ref: '#/responses/UnprocessableError'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.put('/push', authenticate, pushPendingPayment);

/**
 * @swagger
 * /api/payment/transfer-email:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Transfer using account email
 *      tags: [Payment]
 *      operationId: transfer-email
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: email
 *           required: true
 *           schema:
 *             - type: string
 *           description: User email
 *         - in: query
 *           name: cardId
 *           required: false
 *           schema:
 *             - type: string
 *           description: Card identifier
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/NewPaymentData'
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/PaymentData'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          422:
 *              $ref: '#/responses/UnprocessableError'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post('/transfer-email', authenticate, transfer);

/**
 * @swagger
 * /api/payment/transfer-cvu:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Transfer using account CVU
 *      tags: [Payment]
 *      operationId: transfer-cvu
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: cvu
 *           required: true
 *           schema:
 *             - type: string
 *           description: Account CVU
 *         - in: query
 *           name: cardId
 *           required: false
 *           schema:
 *             - type: string
 *           description: Card identifier
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/NewPaymentData'
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/PaymentData'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          422:
 *              $ref: '#/responses/UnprocessableError'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post('/transfer-cvu', authenticate, transfer);

/**
 * @swagger
 * /api/payment/transfer-alias:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Transfer using account alias
 *      tags: [Payment]
 *      operationId: transfer-alias
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: alias
 *           required: true
 *           schema:
 *             - type: string
 *           description: Account alias
 *         - in: query
 *           name: cardId
 *           required: false
 *           schema:
 *             - type: string
 *           description: Card identifier
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/NewPaymentData'
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/PaymentData'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          422:
 *              $ref: '#/responses/UnprocessableError'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post('/transfer-alias', authenticate, transfer);

/**
 * @swagger
 * /api/payment:
 *  get:
 *      security:
 *        - bearerAuth: []
 *      summary: Get payments
 *      tags: [Payment]
 *      operationId: getPayments
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: page
 *           default: 1
 *           schema:
 *             type: integer
 *           description: Page number
 *         - in: query
 *           name: direction
 *           default: "ASC"
 *           schema:
 *             type: string
 *             enum: ["ASC", "DESC"]
 *           description: Sort direction (ASC or DESC)
 *         - in: query
 *           name: pending
 *           default: null
 *           schema:
 *             type: boolean
 *           description: Payment status filter (pending or confirmed)
 *         - in: query
 *           name: method
 *           default: null
 *           schema:
 *             type: string
 *             enum: ["ACCOUNT", "CARD"]
 *           description: Payments method filter (ACCOUNT or CARD)
 *         - in: query
 *           name: range
 *           default: null
 *           schema:
 *             type: string
 *           description: Payment date range filter (THREE_DAYS, LAST_WEEK or LAST_MONTH)
 *         - in: query
 *           name: role
 *           default: null
 *           schema:
 *             type: string
 *           description: Payment user role (PAYER or RECEIVER)
 *         - in: query
 *           name: cardId
 *           default: null
 *           schema:
 *             type: integer
 *           description: Payment card identifier filter
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      paging:
 *                        $ref: '#/definitions/PagingData'
 *                      results:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/PaymentData'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.get('/', authenticate, getPayments);

/**
 * @swagger
 * /api/payment/{id}:
 *  get:
 *      security:
 *        - bearerAuth: []
 *      summary: Get payment
 *      tags: [Payment]
 *      operationId: getPayment
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             - type: integer
 *           description: Payment indetifier
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/PaymentData'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.get('/:id', authenticate, getPayment);

export default router;