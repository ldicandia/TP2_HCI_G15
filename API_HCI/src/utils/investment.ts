import { DailyInterest } from "../entities/dailyInterest";
import { DailyReturn } from "../entities/dailyReturn";
import { InvestmentDailyRateData, InvestmentDailyReturnData } from "../types/investment";

export function mapEntityToInvestmentDailyRateData(
    dailyInterest: DailyInterest
): InvestmentDailyRateData {
    return {
        interest: dailyInterest.rate
    };
}

export function mapEntityToInvestmentReturnData(
    dailyReturn: DailyReturn
): InvestmentDailyReturnData {
    return {
        id: dailyReturn.id,
        return: dailyReturn.returnGiven,
        date: dailyReturn.createdAt.toISOString().substring(0, 10)
    };
}