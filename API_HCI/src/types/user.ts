import { ValidationResult, validateEmail } from "./common";
import {
    IsDateString,
    IsEmail,
    MinLength,
    //    IsOptional,
    //    IsUrl,
    Length,
    isEmpty
} from "class-validator";
import * as ValidatorJS from 'validator';

export type NewUserData = {
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    password: string;
    metadata?: object;
}

// REVIEWED
export function validateNewUserData(
    data: any
): ValidationResult {
    if (!('email' in data) || data.email.length <= 0)
        return { isValid: false, message: 'Missing email.' };

    let validationResult = validateEmail(data.email);
    if (!validationResult.isValid)
        return { isValid: false, message: validationResult.message };

    if (!("password" in data) || data.password.length <= 0)
        return { isValid: false, message: "Missing password." };

    if (data.password.length < 6)
        return { isValid: false, message: "Password must be at least 6 characters long." };

    if (!("firstName" in data) || data.firstName.length <= 0)
        return { isValid: false, message: "Missing first name." };

    if (!("lastName" in data) || data.lastName.length <= 0)
        return { isValid: false, message: "Missing last name." };

    if (!("birthDate" in data) || data.birthDate.length <= 0)
        return { isValid: false, message: "Missing birth date." };

    validationResult = validateBirthDate(data.birthDate);
    if (!validationResult.isValid)
        return { isValid: false, message: validationResult.message };

    return { isValid: true };
}

export type UserData = {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    metadata?: object;
}

export type CredentialsData = {
  email: string;
  password: string;
}

export function validateCredentialsData(
    data: any
): ValidationResult {
    if (!("email" in data) || data.email.length <= 0) {
        return { isValid: false, message: "Missing email." };
    }

    let validationResult = validateEmail(data.email);
    if (!validationResult.isValid)
        return { isValid: false, message: validationResult.message };

    if (!("password" in data) || data.password.length <= 0) {
        return { isValid: false, message: "Missing password." };
    }

    return { isValid: true };
}

export function validateVerificationCode(
    code: string
): ValidationResult {
  if (isEmpty(code)) {
    return { isValid: false, message: "Missing code." };
  }

  return { isValid: true };
}

export type ChangePasswordData = {
  code: string;
  password: string;
}

export function validateChangePasswordData(
    data: any
): ValidationResult {
  if (!('code' in data) || data.code.length <= 0) {
    return { isValid: false, message: "Missing token." };
  }

  if (!('password' in data) || data.password.length <= 0) {
    return { isValid: false, message: "Missing password." };
  }

  return { isValid: true };
}

// REVIEWED
export function validateBirthDate(
    birthDate: string
): ValidationResult {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
        return {
            isValid: false,
            message: 'Invalid birth date format. Valid format YYYY-MM-DD.'
        };
    }

    const _birthDate = new Date(birthDate);
    if (isNaN(_birthDate.getTime())) {
        return {
            isValid: false,
            message: 'Invalid birth date.'
        };
    }

    const today = new Date();
    const year = _birthDate.getFullYear();
    if (year < 1900 || year > today.getFullYear()) {
        return {
            isValid: false,
            message: `Year must be between 1900 and ${today.getFullYear()}.`
        };
    }

    const ageDiff = today.getFullYear() - _birthDate.getFullYear();
    const monthDiff = today.getMonth() - _birthDate.getMonth();
    const dayDiff = today.getDate() - _birthDate.getDate();

    if (ageDiff > 13 || (ageDiff === 13 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))) {
        return { isValid: true };
    }

    return {
        isValid: false,
        message: 'User must be at least 13 years old.'
    };
}