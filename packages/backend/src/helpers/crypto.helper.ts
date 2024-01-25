import { compare, hash } from 'bcrypt';

const salt = 10;

export const encrypt = async (text: string): Promise<string> => hash(text, salt);

export const decrypt = async (encrypted: string, text: string): Promise<boolean> =>
  compare(encrypted, text);
