import { ref, computed } from "vue"
import { defineStore } from "pinia";
import { UserApi } from "@/api/user";
import { Api } from "@/api/api";

const SECURITY_TOKEN_KEY = "security-token";

export const useSecurityStore = defineStore("security", () => {
    const token = ref(null);
    const user = ref(null);

    const isLoggedIn = computed(() => {
        return token.value != null;
    });

    function initialize() {
        const token = localStorage.getItem(SECURITY_TOKEN_KEY);
        if (token) setToken(token);
    }

    function setUser(value) {
        user.value = value;
    }

    function setToken(value) {
        token.value = value;
        Api.token = value;
    }

    function updateToken(value, rememberMe) {
        if (rememberMe) localStorage.setItem(SECURITY_TOKEN_KEY, value);
        setToken(value);
    }

    function removeToken() {
        localStorage.removeItem(SECURITY_TOKEN_KEY);
        setToken(null);
    }

    async function login(credentials, rememberMe) {
        const result = await UserApi.login(credentials);
        updateToken(result.token, rememberMe);
    }

    async function register(user) {
        const result = await UserApi.createUser(user, user.controller);
        updateToken(result.token, user.rememberMe);
    }

    async function verify(code) {
        const result = await UserApi.verify(code, user.controller);
        if (result) {
            setUser(result);
        } else {
            removeToken();
        }
    }

    async function logout() {
        try {
            await UserApi.logout();
        } finally {
            removeToken();
        }
    }

    async function getCurrentUser() {
        if (user.value) return user.value;
        const result = await UserApi.get();
        setUser(result);
    }

    return {user, isLoggedIn, initialize, login, logout, getCurrentUser, register, verify };
});
