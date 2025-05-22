import { isEmpty, isEnum, matches } from "class-validator";
import { CardType } from "../entities/cardType";
import { ValidationResult } from "./common";

export type NewCardData = {
    type: CardType;
    number: string;
    expirationDate: string;
    fullName: string;
    cvv: string;
    metadata?: object;
}

export function validateNewCardData(
    data: any
): ValidationResult {
    if (!('number' in data))
        return { isValid: false, message: "Missing card number." };

    if (!matches(data.number, /^\d{15}$|^\d{16}$|^\d{19}$/))
        return { isValid: false, message: "Invalid card number. It must be 15, 16, or 19 digits." };

    if (!('cvv' in data))
        return { isValid: false, message: "Missing CVV." };

    if (!matches(data.cvv, /^\d{3,4}$/))
        return { isValid: false, message: "Invalid CVV. It must be 3 or 4 digits." };

    if (!("expirationDate" in data))
        return { isValid: false, message: "Missing expiration date." };

    if (!matches(data.expirationDate, /^(0[1-9]|1[0-2])\/\d{2}$/))
        return { isValid: false, message: "Invalid expiration date format. Valid format MM/YY." };

    const [month, year] = data.expirationDate.split('/').map(Number);
    if (year < 24 || (year === 24 && month < 11))
        return { isValid: false, message: "Card expired." };

    if (!("fullName" in data) || isEmpty(data.fullName))
        return { isValid: false, message: "Missing full name." };

    if (!("type" in data))
        return { isValid: false, message: "Missing card type." };

    if (!isEnum(data.type, CardType))
        return { isValid: false, message: "Invalid card type. Valid values are 'CREDIT' or 'DEBIT'." };

    return { isValid: true };
}

export type CardData = {
    id: number,
    type: CardType;
    number: string;
    expirationDate: string;
    fullName: string;
    metadata?: object;
}