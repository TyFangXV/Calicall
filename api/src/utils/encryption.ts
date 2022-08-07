import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = "FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs="; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16;

if(!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY must be 32 characters");
}

export function encrypt(text: string):string {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'base64'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
export function decrypt(text: string):string {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift() as string, 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'base64'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
