import * as crypto from 'crypto';

export class AuthHelper {
    static hasPassword(value: string): string {
        return crypto.createHash('md5').update(value).digest('hex')
    }
}

