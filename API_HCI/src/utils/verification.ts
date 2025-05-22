import {randomBytes} from 'crypto';

export function generateVerificationCode() {
    return randomBytes(8).toString('hex');
}