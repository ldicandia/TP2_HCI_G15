class Api {
    static token;

    static get baseUrl() {
        return "http://localhost:8080/api";
    }

    static get timeout() {
        return 60 * 1000;
    }

    static async fetch(url, secure, init = {}, controller) {
        if (secure && Api.token) {
            if (!init.headers)
                init.headers = {};

            init.headers["Authorization"] = `bearer ${Api.token}`;
        }

        controller = controller || new AbortController();
        init.signal = controller.signal;
        const timer = setTimeout(() => controller.abort(), Api.timeout);

        try {
            const response = await fetch(url, init);
            const text = await response.text();
            const json = text ? JSON.parse(text) : {};
            if (json.message) throw { code: 97, description: json.message };
            return json;
        } catch (error) {
            if (error.name === "AbortError")
                throw { code: 98, description: error.message.toLowerCase() };
            else if (error.name === "TypeError")
                throw { code: 99, description: error.message.toLowerCase() };
            else
                throw error;
        } finally {
            clearTimeout(timer);
        }
    }

    static async get(url, secure, controller) {
        return await Api.fetch(url, secure, {}, controller);
    }

    static async post(url, secure, data, controller) {
        return await Api.fetch(url, secure, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data)
        }, controller);
    }

    static async put(url, secure, data, controller) {
        return await Api.fetch(url, secure, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(data)
        }, controller);
    }

    static async delete(url, secure, controller) {
        return await Api.fetch(url, secure, {
            method: "DELETE",
        }, controller);
    }
}

export { Api }