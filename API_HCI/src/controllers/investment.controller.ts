import { Request, Response } from "express";
import { replySuccess, replyWithError } from "../http";
import * as InvestmentService from "../services/investment.service";
import { mapEntityToInvestmentDailyRateData, mapEntityToInvestmentReturnData } from "../utils/investment";
import { validateAmount, validatePage, validatePageSize } from "../types/common";
import { BadRequestError } from "../types/error";
import { User } from "../entities/user";
import { mapEntityToAccountData } from "../utils/account";
import { DailyReturn } from "../entities/dailyReturn";

export async function getInvestmentDailyRate(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const today = new Date();
        const dailyInterest = await InvestmentService.getInvestmentDailyRate(today);
        replySuccess(res, mapEntityToInvestmentDailyRateData(dailyInterest));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function invest(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateAmount(req.query);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const user: User = req.user as User;
        const amount = parseFloat(req.query.amount as string);
        const account = await InvestmentService.invest(user, amount);
        replySuccess(res, mapEntityToAccountData(account));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function divest(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateAmount(req.query);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const user: User = req.user as User;
        const amount = parseFloat(req.query.amount as string);
        const account = await InvestmentService.divest(user, amount);
        replySuccess(res, mapEntityToAccountData(account));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function getDailyInvestmentReturns(
    req: Request,
    res: Response
): Promise<void> {
    try {
        let validationResult = validatePage(req.query);
        const page = (!validationResult.isValid) ? 1 : parseInt(req.query.page as string);
        validationResult = validatePageSize(req.query);
	    const pageSize = (!validationResult.isValid) ? 10 : parseInt(req.query.pageSize as string);

        const user: User = req.user as User;
        const dailyReturns: [number, number, DailyReturn[]] = await InvestmentService.getInvestmentDailyReturns(user, page, pageSize);
        const content = {
            paging: {
                page,
                pageSize,
                pageCount: dailyReturns[0],
                totalCount: dailyReturns[1]
            },
            results: dailyReturns[2].map(dailyReturn => mapEntityToInvestmentReturnData(dailyReturn))
        }
        replySuccess(res, content);
    } catch (err) {
        replyWithError(res, err);
    }
}