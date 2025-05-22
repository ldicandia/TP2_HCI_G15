import { QueryFailedError } from "typeorm";
import { Card } from "../entities/card";
import { User } from "../entities/user";
import { BadRequestError, NotFoundError } from "../types/error";

export async function findCard(
    user: User,
    cardId: number
): Promise<Card> {
    const card: Card =
        await Card.findOne({
            where: {
                user: {
                    id: user.id
                },
                id: cardId
            },
            relations: ["user"]
        });
    if (!card) throw new NotFoundError("Card not found.");
    return card;
}

export async function findCards(
    user: User,
    relations: string[] = []
): Promise<Card[]> {
    const cards: Card[] =
        await Card.find({
            where: {
                user: {
                    id: user.id
                }
            },
            relations
        });
    return cards;
}

export async function getCards(
    user: User
): Promise<Card[]> {
    try {
        return await findCards(user);
    } catch (err: unknown) {
        throw err;
    }
}

export async function getCard(
    user: User,
    cardId: number
): Promise<Card> {
    try {
        return await findCard(user, cardId);
    } catch (err: unknown) {
        throw err;
    }
}

export async function addCard(
    user: User,
    newCard: Card
): Promise<Card> {
    try {
        newCard.user = user;
        return await newCard.save();
    } catch (err: unknown) {
        if ((err as QueryFailedError).driverError.message.includes("UNIQUE constraint failed: card.number, card.userId"))
            throw new BadRequestError("Card already added.");
        throw err;
    }
}

export async function deleteCard(
    user: User,
    cardId: number
): Promise<void> {
    try {
        const card: Card = await findCard(user, cardId);
        await card.remove();
    } catch (err: unknown) {
        throw err;
    }
}