import { ref } from "vue"
import { defineStore } from "pinia"
import { Card, CardApi } from "@/api/card.js"

export const useCardStore = defineStore("card", () => {
    const cards = ref([])

    async function add(card) {
        const result = await CardApi.add(card)
        const newCard = Object.assign(new Card(), result);
        cards.value.push(newCard);
        return newCard;
    }
    async function modify(card) {
        const result = await CardApi.modify(card);
        await getAll();
        return result;
    }

    async function remove(id) {
        const result = await CardApi.remove(id);
        await getAll();
        return result;
    }
    async function get(id) {
        const result = await CardApi.get(id);
        await getAll();
        return Object.assign(new Card(), result);
    }

    async function getAll(controller = null) {
        let result = await CardApi.getAll(controller);
        result = result.map((card) => Object.assign(new Card(), card));
        cards.value = result;
    }

    return { cards, add, modify, remove, get, getAll }
})
