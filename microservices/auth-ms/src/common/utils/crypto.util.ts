//src/common/utils/crypto.util.ts

import { randomBytes, createHmac } from 'crypto';

export const cryptoRandom = (len = 48) => randomBytes(len).toString('hex');

export const hmacSha256 = (data: string, key: string) =>
  createHmac('sha256', key).update(data).digest('hex');

