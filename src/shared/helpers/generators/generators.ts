import bcrypt from 'bcryptjs';
import { config } from '@configs/configEnv';

export class Generators {
  static hash(password: string): Promise<string> {
    return bcrypt.hash(password, Number(config.SALT_ROUND));
  }

  static allLetterLowercase(str: string): string {
    return str.toLowerCase();
  }

  static firstLetterCapitalized(str: string): string {
    const stringCapitalized = str.toLowerCase();

    return stringCapitalized
      .split(' ')
      .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
      .join(' ');
  }
}
