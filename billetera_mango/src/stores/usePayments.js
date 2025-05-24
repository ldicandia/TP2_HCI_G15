import { ref } from "vue"
import { defineStore } from "pinia"
import {Payment, PaymentsApi } from "@/api/payments";

export const usePaymentsStore = defineStore("payments", () => {
    const payments = ref([]);
    const payment = ref(null);

    async function add(paymentData) {
        const result = await PaymentsApi.create(paymentData);
        const newPayment = Object.assign(new Payment(), result);
        payments.value.push(newPayment);
        return newPayment;
    }

    async function pullPayment(paymentData) {
        const result = await PaymentsApi.pullPayment(paymentData);
        return result;
    }
    async function pushPayment(paymentData) {
        const result = await PaymentsApi.pushPayment(paymentData);
        return result;
    }
    async function transferByEmail(email, paymentData) {
        const result = await PaymentsApi.transferByEmail(email, paymentData);
        return result;
    }
    async function transferByCvu(cvu, paymentData) {
        const result = await PaymentsApi.transferByCvu(cvu, paymentData);
        return result;
    }
    async function transferByAlias(alias, paymentData) {
        const result = await PaymentsApi.transferByAlias(alias, paymentData);
        return result;
    }
    async function getAll(queryParams = {}, controller = null) {
        let result = await PaymentsApi.getAll(queryParams, controller);
        // result = result.map((payment) => Object.assign(new Payment(), payment));
        payments.value = result;
    }
    async function getById(id, controller = null) {
        const result = await PaymentsApi.getById(id, controller);
        payment.value = Object.assign(new Payment(), result);
    }

    return {
        payments,
        payment,
        add,
        pullPayment,
        pushPayment,
        transferByEmail,
        transferByCvu,
        transferByAlias,
        getAll,
        getById
    }
  });

