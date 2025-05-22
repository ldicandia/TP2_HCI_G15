export class HttpError {
    constructor(
        public status: number, public message: string | string[]
    ) {
        this.status = status;
        this.message = message;
    }
}

export class BadRequestError extends HttpError {
    constructor(
        message: string | string[] = "Bad request."
    ) {
        super(400, message);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(
        message: string | string[] = "Unauthorized."
    ) {
        super(401, message);
    }
}

export class NotFoundError extends HttpError {
    constructor(
        message: string | string[] = "Not found."
    ) {
        super(404, message);
    }
}

export class UnprocessableError extends HttpError {
    constructor(
        message: string | string[] = "Unprocessable content."
    ) {
        super(422, message);
    }
}

export class ServerError extends HttpError {
    constructor(
        message: string | string[] = "Server error."
    ) {
        super(500, message);
    }
}