import * as fs from 'fs';
import * as path from 'path';
import { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const DEFAULT_REGISTRATION_SUBJECT = "Email verification"
const DEFAULT_RESET_PASSWORD_SUBJECT = "Reset Password Verification"
const DEFAULT_REGISTRATION_TEMPLATE =
    `<div style="text-align: center;">
        <h1>
        <strong>Welcome <%FIRST_NAME%></strong>
        </h1>
        <h3>
        <strong>Your verification code is <span style="color: #fc987e;"><%VERIFICATION_CODE%></span></strong>
        </h3>
    </div>`
const DEFAULT_RESET_PASSWORD_TEMPLATE =
    `<div style="text-align: center;">
        <h1>
        <strong>Password recovery</strong>
        </h1>
        <p>
        <span>Valid until <%EXPIRATION_DATE%></span>
        </p>
        <h3>
        <strong>Your code is <span style="color: #fc987e;"><%VERIFICATION_CODE%></span></strong>
        </h3>
    </div>`;

export enum EmailType {
    REGISTRATION = "REGISTRATION",
    RESET_PASSWORD = "RESET_PASSWORD"
}

export class Mailer {
    private transporter: Transporter;
    private baseEmailOptions: Mail.Options = {
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
    }

    constructor(transporter: Transporter) {
        this.transporter = transporter;
    }

    async sendEmail(
        type: EmailType, ...params: any
    ) {
        if (!this.transporter) throw new Error('Mailer service not initialized');
        switch (type) {
            case EmailType.REGISTRATION:
                await this.sendRegistrationEmail(params[0], params[1]);
                break;
            case EmailType.RESET_PASSWORD:
                await this.sendResetPasswordEmail(params[0], params[1]);
                break;
            default:
                throw new Error('Invalid email type');
        }
    }

    private async sendRegistrationEmail(
        firstName: string, verificationCode: string
    ) {
        const subject =
            process.env.REGISTRATION_SUBJECT ?
                process.env.REGISTRATION_SUBJECT :
                DEFAULT_REGISTRATION_SUBJECT;
        const emailOptions: Mail.Options = {
            ...this.baseEmailOptions,
            subject,
            html: this.getRegistrationEmailTemplate(firstName, verificationCode)
        }
        await this.transporter.sendMail(emailOptions);
    }

    private async sendResetPasswordEmail(
        token: string, expirationDate: Date
    ): Promise<void> {
        const subject =
            process.env.RESET_PASSWORD_SUBJECT ?
                process.env.RESET_PASSWORD_SUBJECT :
                DEFAULT_RESET_PASSWORD_SUBJECT;
        const emailOptions: Mail.Options = {
            ...this.baseEmailOptions,
            subject,
            html: this.getResetPasswordEmailTemplate(token, expirationDate)
        }
        await this.transporter.sendMail(emailOptions);
    }

    private getRegistrationEmailTemplate(
        firstName: string, verificationCode: string
    ): string {
        let template = readFileContent("templates/registration.mft");
        if (!template) template = DEFAULT_REGISTRATION_TEMPLATE;

        return template
            .replace('<%FIRST_NAME%>', firstName)
            .replace('<%VERIFICATION_CODE%>', verificationCode);
    }

    private getResetPasswordEmailTemplate(
        token: string, expirationDate: Date
    ): string {
        let template = readFileContent("templates/reset-password.mft");
        if (!template) template = DEFAULT_RESET_PASSWORD_TEMPLATE;

        return template
            .replace('<%EXPIRATION_DATE%>', expirationDate.toLocaleString())
            .replace('<%VERIFICATION_CODE%>', token);
    }
}

function readFileContent(filePath: string): string {
    try {
        const absolutePath = path.resolve(filePath);
        const fileContent = fs.readFileSync(absolutePath, 'utf-8');
        return fileContent;
    } catch (error) {
        console.error(`Error reading file: ${error}`);
        return null;
    }
}