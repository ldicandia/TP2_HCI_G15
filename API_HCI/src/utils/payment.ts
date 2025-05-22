import { Card } from "../entities/card";
import { Payment } from "../entities/payment";
import { User } from "../entities/user";
import { NewPaymentData, PaymentCardData, PaymentData, PaymentUserData, PendingPaymentData } from "../types/payment";
import { obfuscateCardNumber } from "./card";

export function mapNewPaymentDataToEntity(
    newPaymentData: NewPaymentData
): Payment {
    const payment: Payment = new Payment();
    payment.amount = newPaymentData.amount;
    payment.description = newPaymentData.description;
    payment.metadata = newPaymentData?.metadata;
    return payment;
}

export function mapEntityToPendingPaymentData(
    payment: Payment
): PendingPaymentData {
    return {
        id: payment.id,
        description: payment.description,
        amount: payment.amount,
        pending: payment.pending,
        uuid: payment.uuid,
        method: payment.method,
        payer: mapUserPaymentData(payment.payer),
        receiver: mapUserPaymentData(payment.receiver),
        card: mapCardPaymentData(payment.card),
        metadata: payment.metadata
    };
}

export function mapEntityToPaymentData(
    payment: Payment
): PaymentData {
    return {
        id: payment.id,
        description: payment.description,
        amount: payment.amount,
        pending: payment.pending,
        uuid: payment.uuid,
        method: payment.method,
        payer: mapUserPaymentData(payment.payer),
        receiver: mapUserPaymentData(payment.receiver),
        card: mapCardPaymentData(payment.card),
        metadata: payment.metadata
    };
}

export function mapUserPaymentData(
    user: User
): PaymentUserData | null {
    if (!user) return null;
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
    }
}

export function mapCardPaymentData(
    card: Card
): PaymentCardData | null {
    if (!card) return null;
    return {
        id: card.id,
        number: obfuscateCardNumber(card.number)
    }
}