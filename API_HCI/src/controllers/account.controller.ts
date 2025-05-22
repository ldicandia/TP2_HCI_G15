import { Request, Response } from "express";
import { replySuccess, replyWithError } from "../http";
import * as AccountService from "../services/account.service";
import { User } from "../entities/user"
import { validateAmount } from "../types/common";
import { BadRequestError } from "../types/error";
import { validateAccountAlias, validateAccountCvu } from "../types/account";
import { Account } from "../entities/account";
import { mapEntityToAccountData, mapEntityToAccountUserData } from "../utils/account";

export async function getAccount(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const user: User = req.user as User;
        const account: Account = await AccountService.getAccountByUser(user);
        replySuccess(res, mapEntityToAccountData(account));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function rechargeAccountBalance(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateAmount(req.query);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const user: User = req.user as User;
        const amount = parseFloat(req.query.amount as string);
        const account: Account = await AccountService.rechargeAccountBalance(user, amount);
        replySuccess(res, mapEntityToAccountData(account));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function updateAccountAlias(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateAccountAlias(req.query);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const user: User = req.user as User;
        const alias = req.query.alias as string;
        const account: Account = await AccountService.updateAccountAlias(user, alias);
        replySuccess(res, mapEntityToAccountData(account));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function verifyAccountCvu(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateAccountCvu(req.query);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const cvu = req.query.cvu as string;
        const user: User = await AccountService.getAccountUserByCvu(cvu);
        replySuccess(res, mapEntityToAccountUserData(user));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function verifyAccountAlias(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateAccountAlias(req.query);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const alias = req.query.alias as string;
        const user: User = await AccountService.getAccountUserByAlias(alias) 
        replySuccess(res, mapEntityToAccountUserData(user));
    } catch (err) {
        replyWithError(res, err);
    }
}
