import { QueryFailedError } from "typeorm";
import { Account } from "../entities/account";
import { User } from "../entities/user"
import { AccountData, AccountUserData } from "../types/account";
import { BadRequestError, NotFoundError } from "../types/error";
import { mapEntityToAccountData } from "../utils/account";

export async function findAccountByUser(
    user: User
): Promise<Account> {
    const account: Account =
        await Account.findOne({
            where: {
                user: {
                    id: user.id
                }
            },
            relations: ["user"]
        });
    if (!account) throw new NotFoundError("Account not found.");
    return account;
}

export async function findAccountByCvu(
    cvu: string
): Promise<Account> {
    const account: Account =
        await Account.findOne({
            where: {
                cvu: cvu
            },
            relations: ["user"]
        });
    if (!account) throw new NotFoundError("Account not found.");
    return account;
}

export async function findAccountByAlias(
    alias: string
): Promise<Account> {
    const account: Account =
        await Account.findOne({
            where: {
                alias: alias
            },
            relations: ["user"]
        });
    if (!account) throw new NotFoundError("Account not found.");
    return account;
}

export async function getAccountByUser(
    user: User
): Promise<Account> {
    try {
        return await findAccountByUser(user);
    } catch (err: unknown) {
        throw err;
    }
}

export async function rechargeAccountBalance(
    user: User,
    amount: number
): Promise<Account> {
    try {
        const account: Account = await findAccountByUser(user);
        account.balance += amount;
        return await account.save();
    } catch (err: unknown) {
        throw err;
    }
}

export async function updateAccountAlias(
    user: User,
    newAlias: string
): Promise<Account> {
    try {
        const account: Account = await findAccountByUser(user);
        account.alias = newAlias;
        return await account.save();
    } catch (err: unknown) {
        if ((err as QueryFailedError).driverError.message.includes("UNIQUE constraint failed: account.alias"))
            throw new BadRequestError("Alias already in use.");
        throw err;
    }
}

export async function getAccountUserByCvu(
    cvu: string
): Promise<User> {
    try {
        const account: Account = await findAccountByCvu(cvu);
        return account.user;
    } catch (err: unknown) {
        throw err;
    }
}

export async function getAccountUserByAlias(
    alias: string
): Promise<User> {
    try {
        const account: Account = await findAccountByAlias(alias);
        return account.user;
    } catch (err: unknown) {
        throw err;
    }
}