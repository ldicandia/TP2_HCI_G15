import { isEnum, isUUID } from "class-validator";
import { validateAmount, validateDescription, validateEmail, validateId, ValidationResult } from "./common";
import { PaymentMethod } from "../entities/paymentMethod";

export type NewPaymentData = {
    description: string;
    amount: number;
    metadata?: object;
}

export type PendingPaymentData = {
    id: number;
    description: string;
    amount: number;
    pending: boolean;
    uuid: string;
    method: string;
    payer: PaymentUserData;
    receiver: PaymentUserData;
    card: PaymentCardData;
    metadata?: object;
}

export type PaymentUserData = {
    id: number;
    firstName: string;
    lastName: string;
}

export type PaymentCardData = {
    id: number;
    number: string
}

export type PaymentData = {
    id: number;
    description: string;
    amount: number;
    method: string;
    pending: boolean,
    uuid: string,
    payer: PaymentUserData;
    receiver: PaymentUserData;
    card: PaymentCardData;
    metadata?: object;
}

export enum PaymentDateRange {
    THREE_DAYS = "THREE_DAYS",
    LAST_WEEK = "LAST_WEEK",
    LAST_MONTH = "LAST_MONTH",
}

export enum PaymentUserRole {
    PAYER = "PAYER",
    RECEIVER = "RECEIVER"
}

export function validatePaymentData(
    data: any
): ValidationResult {
    let validationResult = validateAmount(data);
    if (!validationResult.isValid) return validationResult;

    validationResult = validateDescription(data);
    if (!validationResult.isValid) return validationResult;

    return { isValid: true };
}

export function validateNewPaymentData(
    data: any
): ValidationResult {
    let validationResult = validateAmount(data);
    if (!validationResult.isValid) return validationResult;

    validationResult = validateDescription(data);
    if (!validationResult.isValid) return validationResult;

    return { isValid: true };
}

export function validatePaymentMethod(
    data: any
): ValidationResult {
    if (!("method" in data))
        return { isValid: false, message: "Missing payment method." };

    if (!isEnum(data.method.toUpperCase(), PaymentMethod))
        return { isValid: false, message: "Invalid payment method. Valid values are 'ACCOUNT' or 'CARD'." };

    return { isValid: true };
}

export function validatePaymentUuid(
    data: any
): ValidationResult {
    if (!("uuid" in data))
        return { isValid: false, message: "Missing payment uuid." };

    if (!isUUID(data.uuid))
        return { isValid: false, message: "Invalid payment uuid." };

    return { isValid: true };
}

export function validatePaymentDateRange(
    data: any
): ValidationResult {
    if (!("range" in data))
        return { isValid: false, message: "Missing payment date range." };

    if (!isEnum(data.range.toUpperCase(), PaymentDateRange))
        return { isValid: false, message: "Invalid payment date range. Valid values are 'THREE_DAYS', 'LAST_WEEK' or 'LAST_MONTH'." };

    return { isValid: true };
}

export function validatePaymentUserRole(
    data: any
): ValidationResult {
    if (!("role" in data))
        return { isValid: false, message: "Missing payment user role." };

    if (!isEnum(data.role.toUpperCase(), PaymentUserRole))
        return { isValid: false, message: "Invalid spayment user role. Valid values are 'PAYER' or 'RECEIVER'." };

    return { isValid: true };
}