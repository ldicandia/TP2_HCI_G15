import { Request, Response } from "express";
import { replyCreated, replySuccess, replyWithError } from "../http";
import { Mailer } from "../services/email.service";
import { User } from "../entities/user";
import * as UserService from "../services/user.service";
import { BadRequestError } from "../types/error";
import {
    ChangePasswordData,
    CredentialsData,
    NewUserData,
    validateChangePasswordData,
    validateCredentialsData,
    validateNewUserData,
    validateVerificationCode
} from '../types/user';
import { mapEntityToUserData, mapNewUserDataToEntity } from "../utils/users";
import { validateEmail } from "../types/common";

export let tokenBlacklist = new Set();

export async function createUser(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateNewUserData(req.body);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const mailer: Mailer = req.app.locals.mailer;
        const newUserData: NewUserData = req.body as NewUserData;
        let newUser: User = mapNewUserDataToEntity(newUserData);
        newUser = await UserService.createUser(newUser, mailer);
        replyCreated(res, mapEntityToUserData(newUser));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function getUser(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const user = await UserService.getUser(req.user as User);
        replySuccess(res, mapEntityToUserData(user) );
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function resendUserVerification(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateEmail(req.query.email as string);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const mailer: Mailer = req.app.locals.mailer;
        const email = req.query.email as string;
        await UserService.resendUserVerification(email, mailer);
        replySuccess(res, {});
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function verifyUser(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateVerificationCode(req.query.code as string);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const code = req.query.code as string;
        replySuccess(res, await UserService.verifyUser(code));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function loginUser(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateCredentialsData(req.body);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const { email, password } = req.body as CredentialsData;
        replySuccess(res, { token: await UserService.loginUser(email, password) });
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function resetUserPassword(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateEmail(req.query.email as string);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const mailer: Mailer = req.app.locals.mailer;
        const email = req.query.email as string;
        await UserService.resetUserPassword(email, mailer);
        replySuccess(res, {});
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function changeUserPassword(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateChangePasswordData(req.body);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        await UserService.changeUserPassword(req.body as ChangePasswordData);
        replySuccess(res, {});
    } catch (err) {
        replyWithError(res, err);
    }
}

export function logoutUser(
    req: Request,
    res: Response
): void {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) tokenBlacklist.add(token);

        replySuccess(res, {});
    } catch (err) {
        replyWithError(res, err);
    }
}