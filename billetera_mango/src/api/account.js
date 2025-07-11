import { Api } from './api';

class AccountApi {
    static getUrl(slug) {
        return `${Api.baseUrl}/account${slug ? `/${slug}` : ''}`;
    }

    static async getAccountDetails(controller) {
        return await Api.get(AccountApi.getUrl(), true, controller);
    }

    static async rechargeBalance(amount, controller) {
        const url = `${AccountApi.getUrl('recharge')}?amount=${encodeURIComponent(amount)}`;
        return await Api.post(url, true, {}, controller);
    }

    static async updateAlias(newAlias, controller) {
        return await Api.put(AccountApi.getUrl('update-alias'), true, newAlias, controller);
    }

    static async verifyCvu(cvu, controller) {
        return await Api.get(AccountApi.getUrl('verify-cvu'), true, cvu, controller);
    }

    static async verifyAlias(alias, controller) {
        return await Api.get(AccountApi.getUrl('verify-alias'), true, alias, controller);
    }

}

class Account {
    constructor(id, balance, alias, cvu, invested) {
        if (id) {
            this.id = id;
        }
        this.balance = balance;
        this.alias = alias;
        this.cvu = cvu;
        this.invested = invested;
    }
    toString() {
        return JSON.stringify(this, null, 2);
    }
}

export { Account, AccountApi };