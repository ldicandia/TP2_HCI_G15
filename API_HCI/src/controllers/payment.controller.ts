import { Request, Response } from "express";
import { NewPaymentData, PaymentDateRange, PaymentUserRole, validateNewPaymentData, validatePaymentData, validatePaymentDateRange, validatePaymentMethod, validatePaymentUserRole, validatePaymentUuid } from "../types/payment";
import { BadRequestError } from "../types/error";
import { replyCreated, replySuccess, replyWithError } from "../http";
import { User } from "../entities/user";
import * as PaymentService from "../services/payment.service";
import { Payment } from "../entities/payment";
import { mapEntityToPaymentData, mapEntityToPendingPaymentData, mapNewPaymentDataToEntity } from "../utils/payment";
import { SortDirection, validateEmail, validateId, validatePage, validatePageSize, validateSortDirection, ValidationResult } from "../types/common";
import { validateAccountAlias, validateAccountCvu } from "../types/account";
import { PaymentMethod } from "../entities/paymentMethod";

export async function pullPayment(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validatePaymentData(req.body);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const user: User = req.user as User;
        const newPaymentData: NewPaymentData = req.body as NewPaymentData;
        let newPayment: Payment = mapNewPaymentDataToEntity(newPaymentData);
        newPayment = await PaymentService.pullPayment(user, newPayment);
        replyCreated(res, mapEntityToPendingPaymentData(newPayment));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function pushPendingPayment(
    req: Request,
    res: Response
): Promise<void> {
    try {
        let validationResult = validatePaymentUuid(req.query);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        if (("cardId" in req.query)) {
            validationResult = validateId(req.query, "card", "cardId");
            if (!validationResult.isValid) throw new BadRequestError(validationResult.message);
        }

        const user: User = req.user as User;
        const paymentUuid = req.query.uuid as string;
        const cardId = req.query.cardId ? parseInt(req.query.cardId as string) : null;
        const payment: Payment = await PaymentService.pushPendingPayment(user, paymentUuid, cardId);
        replyCreated(res, mapEntityToPendingPaymentData(payment));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function transfer(
    req: Request,
    res: Response
): Promise<void> {
    try {
        let validationResult: ValidationResult;
        if (("email" in req.query)) {
            validationResult = validateEmail(req.query.email as string);
            if (!validationResult.isValid) throw new BadRequestError(validationResult.message);
        }

        if (("cvu" in req.query)) {
            validationResult = validateAccountCvu(req.query);
            if (!validationResult.isValid) throw new BadRequestError(validationResult.message);
        }

        if (("alias" in req.query)) {
            validationResult = validateAccountAlias(req.query);
            if (!validationResult.isValid) throw new BadRequestError(validationResult.message);
        }

        if (("cardId" in req.query)) {
            validationResult = validateId(req.query, "card", "cardId");
            if (!validationResult.isValid) throw new BadRequestError(validationResult.message);
        }

        validationResult = validateNewPaymentData(req.body);
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const user: User = req.user as User;
        const email = req.query.email as string;
        const cvu = req.query.cvu as string;
        const alias = req.query.alias as string;       
        const cardId = req.query.cardId ? parseInt(req.query.cardId as string) : null;
        const newPaymentData: NewPaymentData = req.body as NewPaymentData;
        let newPayment: Payment = mapNewPaymentDataToEntity(newPaymentData);
        newPayment = await PaymentService.transfer(user, newPayment, email, cvu, alias, cardId);
        replySuccess(res, mapEntityToPaymentData(newPayment));
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function getPayments(
    req: Request,
    res: Response
): Promise<void> {
    try {
        let validationResult = validatePage(req.query);
        const page = (!validationResult.isValid) ? 1 : parseInt(req.query.page as string);
        validationResult = validatePageSize(req.query);
        const pageSize = (!validationResult.isValid) ? 10 : parseInt(req.query.pageSize as string);
        validationResult = validateSortDirection(req.query);
        const direction: SortDirection =
            (!validationResult.isValid) ?
                SortDirection.DESC :
                SortDirection[req.query.direction as keyof typeof SortDirection];
        validationResult = validatePaymentMethod(req.query);
        const method: PaymentMethod | null =
            (!validationResult.isValid) ?
                null :
                PaymentMethod[req.query.method as keyof typeof PaymentMethod];
        const pending: boolean | null = req.query.pending ? req.query.pending === "true" : null;
        validationResult = validatePaymentDateRange(req.query);
        const range: PaymentDateRange | null =
            (!validationResult.isValid) ?
                null :
                PaymentDateRange[req.query.range as keyof typeof PaymentDateRange];

        validationResult = validatePaymentUserRole(req.query);
        const role: PaymentUserRole | null =
            (!validationResult.isValid) ?
                null :
                PaymentUserRole[req.query.range as keyof typeof PaymentUserRole];

        validationResult = validateId(req.params, "card", "cardId");
        const cardId: number | null = (!validationResult.isValid) ? null : parseInt(req.query.cardId as string);;

        const user: User = req.user as User;
        const payments: [number, number, Payment[]] = await PaymentService.getPayments(user, method, pending, range, role, cardId, page, pageSize, direction);
        const content = {
            paging: {
                page,
                pageSize,
                pageCount: payments[0],
                totalCount: payments[1]
            },
            results: payments[2].map(payment => mapEntityToPaymentData(payment))
        }
        replySuccess(res, content);
    } catch (err) {
        replyWithError(res, err);
    }
}

export async function getPayment(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const validationResult = validateId(req.params, "payment");
        if (!validationResult.isValid) throw new BadRequestError(validationResult.message);

        const user: User = req.user as User;
        const paymentId = parseInt(req.params.id);
        const payment = await PaymentService.getPayment(user, paymentId);
        replySuccess(res, mapEntityToPaymentData(payment));
    } catch (err) {
        replyWithError(res, err);
    }
}
