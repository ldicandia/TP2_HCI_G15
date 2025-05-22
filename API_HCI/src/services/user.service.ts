import { QueryFailedError } from "typeorm";
import { validate } from "class-validator";
import { Account } from "../entities/account";
import { User } from "../entities/user";
import { Verification } from "../entities/verification";
import { VerificationType } from "../entities/verificationType";
import * as VerficationService from "../services/verification.service";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../types/error";
import { ChangePasswordData, UserData } from "../types/user";
import { generateAccoutCvu, generateAccountAlias } from "../utils/account";
import { generateAuthenticationToken } from "../utils/tokens";
import { getHashedPassword, validateHashedPassword } from "../utils/passwords";
import { mapEntityToUserData } from "../utils/users"
import { generateVerificationCode } from "../utils/verification";
import { EmailType, Mailer } from "./email.service";

export async function findUserById(
    userId: number
): Promise<User> {
    const user: User =
        await User.findOne({
            where: {
                id: userId,
            },
        });
    if (!user) throw new NotFoundError("User not found.");
    return user;
}

export async function findUserByEmail(
    email: string,
    relations: string[] = []
): Promise<User> {
    const user: User =
        await User.findOne({
            where: {
                email
            },
            relations
        });
    if (!user) throw new NotFoundError("User not found.");
    return user;
}

export async function createUser(
    newUser: User,
    mailer: Mailer
): Promise<User> {
    try {
        newUser = await newUser.save();

        const account: Account = new Account();
        newUser = account.user = newUser;
        // TODO: no se valida que el CVU y alias sean únicos
        account.alias = generateAccountAlias();
        account.cvu = generateAccoutCvu();
        account.balance = 0;
        account.invested = 0;
        await account.save();

        const verification: Verification = new Verification();
        verification.type = VerificationType.REGISTRATION;
        verification.code = generateVerificationCode();
        verification.expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        verification.user = newUser;
        await verification.save();

        mailer.sendEmail(EmailType.REGISTRATION, newUser.firstName, verification.code);

        return newUser;
    } catch (err: unknown) {
        if ((err as QueryFailedError).driverError.message.includes("UNIQUE constraint failed: user.email"))
            throw new BadRequestError("Email already in use.");
        throw err;
    }
}

export async function getUser(
    user: User
): Promise<User> {
    try {
        return findUserById(user.id);
    } catch (err: unknown) {
        throw err;
    }

}

export async function resendUserVerification(
    email: string,
    mailer: Mailer
): Promise<void> {
    try {
        const user: User = await findUserByEmail(email, ["verification"]);
        const oldVerification = user.verification.find(v => v.type == VerificationType.REGISTRATION);
        if (oldVerification) await oldVerification.remove();

        const newVerification: Verification = new Verification();
        newVerification.type = VerificationType.REGISTRATION;
        newVerification.code = generateVerificationCode();
        newVerification.expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        newVerification.user = user;
        await newVerification.save();

        mailer.sendEmail(EmailType.REGISTRATION, user.firstName, newVerification.code);
    } catch (err: unknown) {
        throw err;
    }
}

export async function verifyUser(
    code: string
): Promise<UserData> {
    try {
        const verification: Verification = await
            VerficationService.getVerification(VerificationType.REGISTRATION, code);

        if (verification.expirationDate < new Date()) throw new BadRequestError("Expired code.");

        const user: User = verification.user;
        if (user.isVerified) throw new BadRequestError("User already verified.");
        user.isVerified = true;
        await user.save();

        await verification.remove();
        return mapEntityToUserData(user);
    } catch (err: unknown) {
        throw err;
    }
}

export async function loginUser(
    email: string,
    password: string
): Promise<string> {
    try {
        const user: User | null = await findUserByEmail(email);
        if (!validateHashedPassword(password, user.password)) throw new BadRequestError("Invalid credentials.");
        if (!user.isVerified) throw new UnauthorizedError("User not verified.");

        return generateAuthenticationToken(user.id);
    } catch (err: unknown) {
        throw err;
    }
}

export async function resetUserPassword(
    email: string,
    mailer: Mailer
): Promise<void> {
    try {
        const user: User = await findUserByEmail(email, ["verification"])
        if (!user.isVerified) throw new UnauthorizedError("User not verified.");

        const oldVerification = user.verification.find(v => v.type == VerificationType.RESET_PASSWORD);
        if (oldVerification) await oldVerification.remove();

        const newVerification: Verification = new Verification();
        newVerification.type = VerificationType.RESET_PASSWORD;
        newVerification.code = generateVerificationCode();
        newVerification.expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        newVerification.user = user;
        await newVerification.save();

        mailer.sendEmail(EmailType.RESET_PASSWORD, newVerification.code, newVerification.expirationDate);
    } catch (err: unknown) {
        throw err;
    }
}

export async function changeUserPassword(
    changePasswordData: ChangePasswordData
): Promise<void> {
    try {
        const verification: Verification = await
            VerficationService.getVerification(VerificationType.RESET_PASSWORD, changePasswordData.code);

        if (verification.expirationDate < new Date()) throw new BadRequestError("Expired code.");

        const user: User = verification.user;
        user.password = getHashedPassword(changePasswordData.password);
        await user.save();

        await verification.remove();
    } catch (err: unknown) {
        throw err;
    }
}