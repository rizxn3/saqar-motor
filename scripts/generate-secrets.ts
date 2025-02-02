import crypto from 'crypto';

const jwtSecret = crypto.randomBytes(32).toString('hex');
const passwordSalt = crypto.randomBytes(16).toString('hex');

console.log('JWT_SECRET=', jwtSecret);
console.log('PASSWORD_SALT=', passwordSalt); 