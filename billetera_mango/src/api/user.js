import { Api } from "./api.js";

export { UserApi, Credentials }

class UserApi {
    
    static getUrl(slug) {
        return `${Api.baseUrl}/user${ slug ? `/${slug}` : ""}`;
    }

    static async createUser(user, controller) {
        return await Api.post(UserApi.getUrl(), false, user, controller);
    }

    static async login(credentials, controller) {
        return await Api.post(UserApi.getUrl("login"), false, credentials, controller);
    }

    static async logout(controller) {
        await Api.post(UserApi.getUrl("logout"), true, controller);
    }

    static async get(controller) {
        return Api.get(UserApi.getUrl(), true, controller);
    }

    static async verify(code, controller) {
        console.log(controller);
        return Api.post(UserApi.getUrl(`verify?code=${code}`), true, {}, controller);
    }
}

class Credentials {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
