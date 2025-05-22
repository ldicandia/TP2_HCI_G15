import { v4 as uuidv4 } from 'uuid';
import { User } from "../entities/user";
import { Payment } from '../entities/payment';
import * as AccountService from "../services/account.service";
import * as CardService from "../services/card.service";
import * as UserService from "../services/user.service";
import { BadRequestError, NotFoundError, UnprocessableError } from '../types/error';
import { Account } from '../entities/account';
import { PaymentMethod } from '../entities/paymentMethod';
import { Between } from 'typeorm';
import { PaymentDateRange, PaymentUserRole } from '../types/payment';
import { SortDirection } from '../types/common';

async function findPayment(
    user: User,
    id: number
): Promise<Payment> {
    const payment: Payment = await Payment.findOne({
        where: [
            { id, payer: { id: user.id } },
            { id, receiver: { id: user.id } }
        ],
        relations: ["payer", "receiver", "card"]
    });
    if (!payment) throw new NotFoundError();
    return payment;
}

async function findPaymentByUuid(
    uuid: string
): Promise<Payment> {
    const payment: Payment =
        await Payment.findOne({
            where: {
                uuid
            },
            relations: ["receiver", "card"]
        });
    if (!payment) throw new NotFoundError("Payment not found.");
    return payment;
}

export async function pullPayment(
    user: User,
    newPayment: Payment
): Promise<Payment> {
    try {
        newPayment.receiver = user;
        newPayment.uuid = uuidv4();
        newPayment.pending = true;
        return await newPayment.save();
    } catch (err: unknown) {
        throw err;
    }
}

export async function pushPendingPayment(
    user: User,
    uuid: string,
    cardId: number | null
) {
    try {
        const payment: Payment = await findPaymentByUuid(uuid);

        if (user.id == payment.receiver.id) throw new UnprocessableError("Payment must be pushed with another user.");

        if (!payment.pending) throw new UnprocessableError("Payment already pushed.");

        if (cardId) {
            payment.method = PaymentMethod.CARD;
            payment.card = await CardService.findCard(user, cardId);
        } else {
            payment.method = PaymentMethod.ACCOUNT;
            const payerAccount = await AccountService.findAccountByUser(user);
            if (payerAccount.balance < payment.amount) throw new UnprocessableError("Insufficient balance.");

            payment.payerBalanceBefore = payerAccount.balance;
            payerAccount.balance -= payment.amount;
            payment.payerBalanceAfter = payerAccount.balance;
            await payerAccount.save();
        }

        const receiverAccount = await AccountService.findAccountByUser(payment.receiver);
        payment.receiverBalanceBefore = receiverAccount.balance;
        receiverAccount.balance += payment.amount;
        payment.receiverBalanceAfter = receiverAccount.balance;
        await receiverAccount.save();

        payment.payer = user;
        payment.pending = false;
        return await payment.save();
    } catch (err: unknown) {
        throw err;
    }
}

export async function transfer(
    user: User,
    newPayment: Payment,
    email: string,
    cvu: string,
    alias: string,
    cardId: number | null
): Promise<Payment> {
    try {
        let receiverUser: User;
        let receiverAccount: Account;

        if (email) {
            receiverUser = await UserService.findUserByEmail(email, ["account"]);
            receiverAccount = receiverUser.account;
        } else if (cvu) {
            receiverAccount = await AccountService.findAccountByCvu(cvu);
            receiverUser = receiverAccount.user;
        } else if (alias) {
            receiverAccount = await AccountService.findAccountByAlias(alias);
            receiverUser = receiverAccount.user;
        } else {
            throw new BadRequestError("Missing receiver email, account cvu or alias.")
        }

        if (user.id == receiverUser.id) throw new UnprocessableError("Payment must be pushed with another user.");

        if (cardId) {
            newPayment.method = PaymentMethod.CARD;
            newPayment.card = await CardService.findCard(user, cardId);
        } else {
            newPayment.method = PaymentMethod.ACCOUNT;
            const payerAccount = await AccountService.findAccountByUser(user);
            if (payerAccount.balance < newPayment.amount) throw new UnprocessableError("Insufficient balance.");

            newPayment.payerBalanceBefore = payerAccount.balance;
            payerAccount.balance -= newPayment.amount;
            newPayment.payerBalanceAfter = payerAccount.balance;
            await payerAccount.save();
        }

        newPayment.receiverBalanceBefore = receiverAccount.balance;
        receiverAccount.balance += newPayment.amount;
        newPayment.receiverBalanceAfter = receiverAccount.balance;
        await receiverAccount.save();

        newPayment.payer = user;
        newPayment.receiver = receiverUser;
        newPayment.pending = false;
        return await newPayment.save();
    } catch (err: unknown) {
        throw err;
    }
}

export async function getPayment(
    user: User,
    paymentId: number
): Promise<Payment> {
    try {
        return await findPayment(user, paymentId)
    } catch (err: unknown) {
        throw err;
    }
}

export async function getPayments(
    user: User,
    method: PaymentMethod | null,
    pending: boolean | null,
    range: PaymentDateRange | null,
    role: PaymentUserRole | null,
    cardId: number | null,
    page: number = 1,
    pageSize: number = 10,
    direction: SortDirection
): Promise<[number, number, Payment[]]> {
    try {
        const whereOptions = generatePaymentsFilteringOptions(user, method, pending, range, role, cardId);
        const totalCount = await Payment.count({
            where: whereOptions,
            relations: ["card", "payer", "receiver"]
        });

        const payments: Payment[] = await Payment.find({
            where: whereOptions,
            relations: ["card", "payer", "receiver"],
            order: { createdAt: direction },
            take: pageSize,
            skip: (page - 1) * pageSize,
        });

        return [Math.ceil(totalCount / pageSize), totalCount, payments];
    } catch (err: unknown) {
        throw err;
    }
}

export function generatePaymentsFilteringOptions(
    user: User,
    method: PaymentMethod | null,
    pending: boolean | null,
    range: PaymentDateRange | null,
    role: PaymentUserRole | null,
    cardId: number | null
) {
    let whereOptions = {};
    if (method !== null) {
        whereOptions = { ...whereOptions, method };
    }
    if (cardId !== null) {
        whereOptions = { ...whereOptions, card: { id: cardId } };
    }
    if (pending !== null) {
        whereOptions = { ...whereOptions, pending };
    }
    if (range) {
        const today = new Date();
        const dayDiff = range === PaymentDateRange.THREE_DAYS ? 3 :
            range === PaymentDateRange.LAST_WEEK ? 7 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dayDiff);
        whereOptions = { ...whereOptions, createdAt: Between(startDate, today) };
    }
    if (role) {
        const sourceObj = role === PaymentUserRole.PAYER ? { payer: { id: user.id } } : { receiver: { id: user.id } };
        whereOptions = { ...whereOptions, ...sourceObj };
    } else {
        // OR operator
        whereOptions = [
            { ...whereOptions, payer: { id: user.id } },
            { ...whereOptions, receiver: { id: user.id } },
        ];
    }
    return whereOptions;
}