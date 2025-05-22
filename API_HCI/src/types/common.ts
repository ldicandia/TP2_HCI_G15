import { IsNumberString, isPositive, isEmail, isEmpty, isEnum } from "class-validator";

export type ValidationResult = {
    isValid: boolean;
    message?: string;
}

export type PagingData = {
    page: number;
    pageSize: number;
    pageCount: number;
    totalCount: number;
}

export type PagedResultsData<T> = {
    paging: PagingData;
    results: T[];
}

export enum SortDirection {
    ASC = "ASC",
    DESC = "DESC",
}

// REVIEWED
export function validateEmail(
    email: string
): ValidationResult {
    if (!isEmail(email))
        return {
            isValid: false,
            message: 'Invalid email. Valid format example@domain.com.'
        };

    return { isValid: true };
}

export function validateId(
    data: any,
    identifier: string,
    entry: string = "id"
): ValidationResult {
    if (!(entry in data))
        return { isValid: false, message: `Missing ${identifier} identifier.` };

    if (!IsNumberString(data[entry]))
        return { isValid: false, message: `Invalid ${identifier} identifier.` };

    const id = parseInt(data[entry]);
    if (!isPositive(id))
        return { isValid: false, message: `Invalid ${identifier} identifier.` };

    return { isValid: true };
}

export function validateAmount(
    data: any
): ValidationResult {
    if (!("amount" in data))
        return { isValid: false, message: "Missing amount." };

    if (!IsNumberString(data.amount))
        return { isValid: false, message: "Amount must be a number." };

    const amount = parseFloat(data.amount);
    if (!isPositive(amount))
        return { isValid: false, message: "Amount must be a positive number." };

    return { isValid: true };
}

export function validateDescription(
    data: any
): ValidationResult {
    if (!("description" in data) || isEmpty(data.description))
        return { isValid: false, message: "Missing description." };

    return { isValid: true };
}

export function validatePage(
    data: any
): ValidationResult {
    if (!("page" in data))
        return { isValid: false, message: "Missing page." };

    if (!IsNumberString(data.page))
        return { isValid: false, message: "Page must be a number." };

    const amount = parseInt(data.page);
    if (!isPositive(amount))
        return { isValid: false, message: "Page must be a positive number." };

    return { isValid: true };
}

export function validatePageSize(
    data: any
): ValidationResult {
    if (!("pageSize" in data))
        return { isValid: false, message: "Missing page size." };

    if (!IsNumberString(data.page))
        return { isValid: false, message: "Page size must be a number." };

    const amount = parseInt(data.pageSize);
    if (!isPositive(amount))
        return { isValid: false, message: "Page size must be a positive number." };

    return { isValid: true };
}

export function validateSortDirection(
    data: any
): ValidationResult {
    if (!("direction" in data))
        return { isValid: false, message: "Missing sort direction." };

    if (!isEnum(data.direction.toUpperCase(), SortDirection))
        return { isValid: false, message: "Invalid sort direction. Valid values are 'ASC' or 'DESC'." };

    return { isValid: true };
}