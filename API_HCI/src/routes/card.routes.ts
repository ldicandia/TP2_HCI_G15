import { Router } from "express";
import {
    addCard,
    deleteCard,
    getCard,
    getCards
} from "../controllers/card.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/card:
 *  get:
 *      security:
 *         - bearerAuth: []
 *      summary: Get cards
 *      tags: [Card]
 *      operationId: getCards
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      cards:
 *                        type: array
 *                        items:
 *                          $ref: '#/definitions/CardData'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.get("", authenticate, getCards);

/**
 * @swagger
 * /api/card/{id}:
 *  get:
 *      security:
 *         - bearerAuth: []
 *      summary: Get card
 *      tags: [Card]
 *      operationId: getCard
 *      produces:
 *         - application/json
 *      parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             - type: number
 *           description: Card identifier
 *      responses:
 *          200:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/CardData'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          404:
 *              $ref: '#/responses/NotFound'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.get("/:id", authenticate, getCard);

/**
 * @swagger
 * /api/card:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Add new card
 *      tags: [Card]
 *      operationId: addCard
 *      produces:
 *         - application/json
 *      requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/NewCardData'
 *      responses:
 *          201:
 *              description: Successful operation
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/definitions/CardData'
 *          400:
 *              $ref: '#/responses/BadRequest'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.post("", authenticate, addCard);

/**
 * @swagger
 * /api/card/{id}:
 *  delete:
 *      security:
 *         - bearerAuth: []
 *      summary: Delete card
 *      tags: [Card]
 *      operationId: deleteCard
 *      parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             - type: number
 *           description: Card identifier
 *      produces:
 *        - application/json
 *      responses:
 *          200:
 *              description: Successful operation
 *          404:
 *              $ref: '#/responses/NotFound'
 *          401:
 *              $ref: '#/responses/Unauthorized'
 *          500:
 *              $ref: '#/responses/ServerError'
 */
router.delete("/:id", authenticate, deleteCard);

export default router;