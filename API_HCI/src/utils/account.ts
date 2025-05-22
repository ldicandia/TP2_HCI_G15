import { Account } from '../entities/account';
import { User } from '../entities/user';
import { AccountData, AccountUserData } from '../types/account';
import words from './words';

export function generateAccoutCvu(
): string {
    const characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ123456789';
    let cvu = '';
    for (let i = 0; i < 20; i++) {
        const idx = Math.floor(Math.random() * characters.length);
        cvu += characters[idx];
    }
    return cvu;
}

export function generateAccountAlias(
): string {
    const wordsArray = words.split('\n');
    const idx1 = Math.floor(Math.random() * wordsArray.length);
    const idx2 = Math.floor(Math.random() * wordsArray.length);
    const idx3 = Math.floor(Math.random() * wordsArray.length);
    return `${wordsArray[idx1].toUpperCase()}.${wordsArray[idx2].toUpperCase()}.${wordsArray[idx3].toUpperCase()}`;
}

export function mapEntityToAccountData(
    account: Account
): AccountData {
    return {
        id: account.id,
        balance: account.balance,
        invested: account.invested,
        cvu: account.cvu, 
        alias: account.alias
    };
}

export function mapEntityToAccountUserData(
    user: User
): AccountUserData {
    return {
        firstName: user.firstName,
        lastName: user.lastName
    };
}
