<template>
    <div id="app">
        <button @click="login()" :disabled="securityStore.isLoggedIn">Login</button>
        <button @click="getCurrentUser()" :disabled="!securityStore.isLoggedIn">Current User</button>
        <button @click="logout()" :disabled="!securityStore.isLoggedIn">Logout</button>
        <label for="email">Email:</label><input name="email" v-model="email" />   
        <label for="password">Password:</label><input name="password" type="password" v-model="password" />
        <br>
        <textarea id="result" v-model="result"></textarea><br />
        <span>Enter o pase card JSON in text area to create a new card</span><br />
        <button @click="createCard()" :disabled="!canCreate">Create Card</button>
        <button @click="getAllCards()" :disabled="!canGetAll">Get All Cards</button>
        <button @click="abort()" :disabled="!canAbort">Abort</button><br>
        <div class="cards" v-if="securityStore.isLoggedIn">
            <div v-for="card in cardStore.cards" :key="card.id" class="card">
                <div class="container" @click="deleteCard(card.id)">
                    <span>{{ card.type }}</span><br>
                    <span>{{ card.number }}</span><br>
                    <span>{{ card.fullName }}</span><br>
                    <span>{{ card.expirationDate }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSecurityStore } from '@/stores/securityStore.js'
import { useCardStore } from '@/stores/cardStore.js'
import { Credentials } from '@/api/user.js'
import { Card } from '@/api/card.js'

const securityStore = useSecurityStore();
const cardStore = useCardStore();

const email = ref("johndoe@email.com");
const password = ref("1234567890");
const canCreate = ref(false);
const result = ref(null);
const controller = ref(null);

const canGetAll = computed(() => {
    return securityStore.isLoggedIn;
});

const canAbort = computed(() => {
    return securityStore.isLoggedIn && controller.value;
});

function setResult(r) {
    result.value = JSON.stringify(r, null, 2);
}

function clearResult() {
    result.value = null;
}

function validateCard(data) {
    if (!data) return false;
    const card = JSON.parse(data);
    return card && card.type && card.number &&
        card.expirationDate && card.fullName && card.cvv;
}

async function login() {
    try {
        const credentials = new Credentials(email.value, password.value);
        await securityStore.login(credentials, true);
        clearResult();
        getAllCards();
    } catch (e) {
        setResult(e);
    }
}

async function logout() {
    try {
        await securityStore.logout();
    } finally {
        clearResult();
    }
}

async function getCurrentUser() {
    try {
        await securityStore.getCurrentUser();
        setResult(securityStore.user);
    } catch (e) {
        setResult(e);
    }
}

async function createCard() {
    // Intenta parsear el JSON ingresado en el `textarea`
    const data = JSON.parse(result.value);
    if (!data)
        setResult("Invalid JSON");

    let card = new Card(
        null,
        data.fullName,
        data.cvv,
        data.number,
        data.expirationDate,
        data.type
    );

    try {
        card = await cardStore.add(card);
        setResult(card);
    } catch (e) {
        setResult(e);
    }
}
async function deleteCard(id) {
    try {
        await cardStore.remove(id);
        clearResult()
    } catch (e) {
        setResult(e);
    }
}

async function getAllCards() {
    try {
        controller.value = new AbortController();
        await cardStore.getAll(controller.value);
        controller.value = null;
        setResult(cardStore.cards);
    } catch (e) {
        setResult(e);
    }
}

onMounted(async () => {
    const securityStore = useSecurityStore();
    await securityStore.initialize();

    if (securityStore.isLoggedIn)
        await cardStore.getAll();
});

watch(result, (newValue) => {
    canCreate.value = securityStore.isLoggedIn &&
        validateCard(newValue);
});
</script>

<style scoped>
textarea {
    height: 10em;
    width: 60em;
}

label {
    font-family: Arial, Helvetica, sans-serif;
    font-size: smaller;
    padding: 0 2px;
}

span {
    font-family: Arial, Helvetica, sans-serif;
    font-size: smaller;
}

button {
    margin: 4px 2px;
}

.cards {
    display: flex;
    flex-wrap: wrap;
    margin-top: 40px;
}

.card {
    font-size: medium;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    width: 210px;
    margin: 10px;
}

.card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.container {
    padding: 2px 16px;
    margin: 10px;
    /*color: #0d050500;*/
}
</style>
