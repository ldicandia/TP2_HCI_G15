import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Account, AccountApi } from '@/api/account';

export const useAccountStore = defineStore('account', () => {
    const account = ref(null);

    async function getAccountDetails(controller = null) {
        const result = await AccountApi.getAccountDetails(controller);
        account.value = Object.assign(new Account(), result);
        return account.value;
    }

    async function rechargeBalance(amount, controller = null) {
        const result = await AccountApi.rechargeBalance(amount, controller);
        await getAccountDetails(controller);
        return result;
    }

    async function updateAlias(newAlias, controller = null) {
        const result = await AccountApi.updateAlias(newAlias, controller);
        await getAccountDetails(controller);
        return result;
    }

    async function verifyCvu(cvu, controller = null) {
        return await AccountApi.verifyCvu(cvu, controller);
    }

    async function verifyAlias(alias, controller = null) {
        return await AccountApi.verifyAlias(alias, controller);
    }

    return {
        account,
        getAccountDetails,
        rechargeBalance,
        updateAlias,
        verifyCvu,
        verifyAlias,
    };
});



