import { Between, LessThanOrEqual } from "typeorm";
import { DailyInterest } from "../entities/dailyInterest";
import { User } from "../entities/user";
import { Account } from "../entities/account";
import { findAccountByUser } from "./account.service";
import { BadRequestError } from "../types/error";
import { DailyReturn } from "../entities/dailyReturn";

async function findDailyInterest(
    date: Date
): Promise<DailyInterest> {
    const dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    const dailyInterest: DailyInterest =
        await DailyInterest.findOne({
            where: {
                createdAt: Between(dateFrom, dateTo)
            }
        });
    return dailyInterest;
}

async function findDailyReturn(
    user: User,
    date: Date
): Promise<DailyReturn> {
    const dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    const dailyReturn: DailyReturn =
        await DailyReturn.findOne({
            where: {
                user: {
                    id: user.id
                },
                createdAt: Between(dateFrom, dateTo)
            }
        });
    return dailyReturn;
}

async function createInvestmentDailyRate(
    date: Date
): Promise<DailyInterest> {
    try {
        // Get a random value between 0.20 and 0.30
        const interestRate = Math.floor(Math.random() * (30 - 20 + 1) + 20) / 100;
        const dailyInterest: DailyInterest = new DailyInterest();
        dailyInterest.rate = parseFloat((interestRate / 365).toFixed(10));
        dailyInterest.createdAt = date;
        return await dailyInterest.save();
    } catch (err: unknown) {
        throw err;
    }
}

export async function getInvestmentDailyRate(
    date: Date
): Promise<DailyInterest> {
    try {
        const dailyInterest: DailyInterest = await findDailyInterest(date);
        if (!dailyInterest) {
            const newDailyInterest = await createInvestmentDailyRate(date);
            return newDailyInterest;
        }

        return dailyInterest;
    } catch (err: unknown) {
        throw err;
    }
}

export async function invest(
    user: User,
    amount: number
): Promise<Account> {
    try {
        const account: Account = await findAccountByUser(user);
        if (account.balance < amount) throw new BadRequestError("Insufficient balance.");

        const date = new Date();
        date.setDate(date.getDate() + 1);
        let dailyReturn: DailyReturn = await findDailyReturn(user, date);
        if (!dailyReturn) {
            dailyReturn = new DailyReturn();
            dailyReturn.returnGiven = 0;
            dailyReturn.investedAfter = 0;
            dailyReturn.user = user;
            dailyReturn.createdAt = date;
        }
        dailyReturn.investedBefore = dailyReturn.investedAfter;
        dailyReturn.investedAfter += amount;
        await dailyReturn.save();

        account.balance -= amount;
        account.invested = dailyReturn.investedAfter;
        return await account.save();
    } catch (err: unknown) {
        throw err;
    }
}

export async function divest(
    user: User,
    amount: number
): Promise<Account> {
    try {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        let dailyReturn: DailyReturn = await findDailyReturn(user, date);
        if (!dailyReturn) throw new BadRequestError("Investment not found.");

        if (dailyReturn.investedAfter < amount) throw new BadRequestError("Insufficient investment.");

        dailyReturn.investedBefore = dailyReturn.investedAfter;
        dailyReturn.investedAfter -= amount;
        await dailyReturn.save();

        const account: Account = await findAccountByUser(user);
        account.balance += amount;
        account.invested = dailyReturn.investedAfter;
        return await account.save();
    } catch (err: unknown) {
        throw err;
    }
}

export async function getInvestmentDailyReturns(
    user: User,
    page: number = 1,
    pageSize: number = 10
): Promise<[number, number, DailyReturn[]]> {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        const totalCount = await DailyReturn.count({
            where: {
                user: {
                    id: user.id
                },
                createdAt: LessThanOrEqual(today)
            }
        });
        const dailyReturns = await DailyReturn.find({
            where: {
                user: {
                    id: user.id
                },
                createdAt: LessThanOrEqual(today)
            },
            order: { createdAt: "DESC" },
            take: pageSize,
            skip: (page - 1) * pageSize,
        });

        return [ Math.ceil(totalCount / pageSize), totalCount, dailyReturns ];
    } catch (err: unknown) {
        throw err;
    }
}