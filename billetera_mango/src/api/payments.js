import { Api } from './api';

class PaymentsApi {
    static getUrl(slug) {
        return `${Api.baseUrl}/payment${slug ? `/${slug}` : ''}`;
    }

    static async create(paymentData, controller) {
        return await Api.post(PaymentsApi.getUrl(), true, paymentData, controller);
    }
    
    static async pullPayment(paymentData, controller) {
        return await Api.post(`${PaymentsApi.getUrl('pull')}`, true, paymentData, controller);
    }

    static async pushPayment(paymentData, controller) {
        return await Api.put(`${PaymentsApi.getUrl('push')}`, true, paymentData, controller);
    }

    static async transferByEmail(email, paymentData, controller) {
        return await Api.post(`${PaymentsApi.getUrl('transfer-email')}?email=${email}`, true, paymentData, controller);
    }

    static async transferByCvu(cvu, paymentData, controller) {
        return await Api.post(`${PaymentsApi.getUrl('transfer-cvu')}?cvu=${cvu}`, true, paymentData, controller);
    }

    static async transferByAlias(alias, paymentData, controller) {
        return await Api.post(`${PaymentsApi.getUrl('transfer-alias')}?alias=${alias}`, true, paymentData, controller);
    }

    static async getAll(queryParams = {}, controller) {
        const queryString = new URLSearchParams(queryParams).toString();
        return await Api.get(`${PaymentsApi.getUrl()}?${queryString}`, true, controller);
    }

    static async getById(id, controller) {
        return await Api.get(PaymentsApi.getUrl(id), true, controller);
    }
}

class Payment {
    constructor(id, amount, type, date, status) {
        if (id) {
            this.id = id;
        }
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.status = status;
    }
    toString() {
        return JSON.stringify(this, null, 2);
    }
}

export { Payment, PaymentsApi };