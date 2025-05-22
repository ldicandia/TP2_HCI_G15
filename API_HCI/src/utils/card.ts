import { Card } from "../entities/card";
import { CardType } from "../entities/cardType";
import { CardData, NewCardData } from "../types/card";

export function mapNewCardDataToEntity(
    newCardData: NewCardData
): Card {
    const card: Card = new Card();
    card.type = newCardData.type;
    card.number = newCardData.number;
    card.expirationDate = newCardData.expirationDate;
    card.fullName = newCardData.fullName;
    card.cvv = newCardData.cvv;
    card.metadata = newCardData?.metadata;
    return card;
}

export function mapEntityToCardData(
    card: Card | null
): CardData {
    if (!card) return;

    return {
        id: card.id,
        type: card.type as CardType,
        number: obfuscateCardNumber(card.number),
        expirationDate: card.expirationDate,
        fullName: card.fullName,
        metadata: card.metadata
    };
}

export function obfuscateCardNumber(
    cardNumber: string
): string {
    if (cardNumber.length !== 15 && cardNumber.length !== 16 && cardNumber.length !== 19) return;
    const asterisks = '*'.repeat(cardNumber.length - 8);
    return `${cardNumber.slice(0, 4)}${asterisks}${cardNumber.slice(-4)}`;
}