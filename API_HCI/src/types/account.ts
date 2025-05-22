import { ValidationResult } from "./common";
import { isEmpty } from "class-validator";

export type AccountData = {
    id: number;
    balance: number;
    invested: number;
    cvu: string;
    alias: string;
}

export type AccountUserData = {
    firstName: string;
    lastName: string;
}

export function validateAccountCvu(
    data: any
): ValidationResult {
    if (!("cvu" in data))
        return { isValid: false, message: "Missing cvu." };

    if (isEmpty(data.cvu))
        return { isValid: false, message: "Invalid cvu." };

    // TODO: validar formato
    return { isValid: true };
}

export function validateAccountAlias(
    data: any
): ValidationResult {
    if (!("alias" in data))
        return { isValid: false, message: "Missing alias." };

    if (isEmpty(data.alias))
        return { isValid: false, message: "Invalid alias." };

    // TODO: validar formato
    return { isValid: true };
}