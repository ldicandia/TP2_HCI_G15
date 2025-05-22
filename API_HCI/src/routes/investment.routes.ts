import { Router } from "express";
import {
    divest,
    getInvestmentDailyRate,
    getDailyInvestmentReturns,
    invest
} from "../controllers/investment.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/investment/daily-rate:
 *  get:
 *      security:
 *         - bearerAuth: []
 *      summary: Get investment daily rate
 *      tags: [Investment]
 *      operationId: getIvestmentDailyRate
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/InvestmentDailyRateData'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.get("/daily-rate", authenticate, getInvestmentDailyRate);

/**
 * @swagger
 * /api/investment/invest:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Invest amount
 *      tags: [Investment]
 *      operationId: invest
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: amount
 *           required: true
 *           schema:
 *             - type: number
 *           description: Amount to invest
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
router.post('/invest', authenticate, invest);

/**
 * @swagger
 * /api/investment/divest:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Divest amount
 *      tags: [Investment]
 *      operationId: divest
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: query
 *           name: amount
 *           required: true
 *           schema:
 *             - type: number
 *           description: Amount to divest
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
router.post('/divest', authenticate, divest);

/**
 * @swagger
 * /api/investment/daily-returns:
 *  get:
 *      security:
 *         - bearerAuth: []
 *      summary: Get investment daily returns
 *      tags: [Investment]
 *      operationId: getDailyInvestmentReturns
 *      parameters:
 *         - in: query
 *           name: page
 *           default: 1
 *           schema:
 *             - type: integer
 *           description: Page number
  *         - in: query
 *           name: pageSize
 *           default: 10
 *           schema:
 *             - type: integer
 *           description: Page size
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
 *                          $ref: '#/definitions/InvestmentDailyReturnData'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.get('/daily-returns', authenticate, getDailyInvestmentReturns);

export default router;