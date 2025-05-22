import { Request, Response } from "express";
import { replyCreated, replySuccess, replyWithError } from "../http";
import { User } from "../entities/user";
import * as CardService from "../services/card.service";
import { BadRequestError } from "../types/error";
import { NewCardData, validateNewCardData } from "../types/card";
import { validateId } from "../types/common";
import { mapEntityToCardData, mapNewCardDataToEntity } from "../utils/card";
import { Card } from "../entities/card";

export async function getCards(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const user: User = req.user as User;
        const cards = await CardService.getCards(user);
        replyCreated(res, cards.map(card => mapEntityToCardData(card)));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function getCard(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateId(req.params, "card");
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const user: User = req.user as User;
        const cardId = parseInt(req.params.id);
        const card = await CardService.getCard(user, cardId);
        replyCreated(res, mapEntityToCardData(card));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function addCard(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateNewCardData(req.body);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const user: User = req.user as User;
        const newCardData: NewCardData = req.body as NewCardData;
        let newCard: Card = mapNewCardDataToEntity(newCardData);
        newCard = await CardService.addCard(user, newCard)
        replyCreated(res, mapEntityToCardData(newCard));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function deleteCard(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateId(req.params, 'card');
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const user: User = req.user as User;
        const cardId = parseInt(req.params.id);
        await CardService.deleteCard(user, cardId);
        replySuccess(res, {});
    } catch (err) {
        replyWithError(res, err);
    }
}