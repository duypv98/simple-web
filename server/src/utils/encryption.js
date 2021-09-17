import { AES } from 'crypto-js';
import { genSalt, hash, compare } from 'bcryptjs';

/**
 * 
 * @param {string} cipher 
 * @returns Decoded Password
 */

export const decodePassword = (cipher) => AES.decrypt(cipher, process.env.ENCODE_PWD_KEY).toString();

/**
 * 
 * @param {string} plainPwd 
 * @returns Hashed Password
 */
export const hashPassword = async (plainPwd) => {
  const salt = await genSalt();
  return hash(`${plainPwd}${process.env.PASSWORD_PEPPER}`, salt);
}

export const comparePassword = (hash, plainPwd) => {
  return compare(`${plainPwd}${process.env.PASSWORD_PEPPER}`, hash);
}

