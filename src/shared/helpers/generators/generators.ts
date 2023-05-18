// aqui iran abstraciones de clases las cuales podran ser implementadas en otros files
// de esta forma se mantiene un arquitectura limpia
import bcrypt from 'bcryptjs';
import { config } from '@configs/configEnv';

export class Generators {
  // metodo para encryptar el password del user
  static hash(password: string): Promise<string> {
    return bcrypt.hash(password, Number(config.SALT_ROUND));
    // el "hash" de bcrypt es la funcion que encrypta el password el cual necesita 2 parametros el 1ro el password y el
    // 2do es el un numero que representa los bytes extras que agregas al hashing del password, por defecto son 10 mientras mayor sea mayor sera la
    // encriptacion y  tardara mas
  }

  // metodo para tener todo el texto en minuscula
  static allLetterLowercase(str: string): string {
    return str.toLowerCase(); //este metodo "toLowerCase" es del lenguaje
  }

  // metodo para solo tener texto con primeras letras en mayusculaa
  static firstLetterCapitalized(str: string): string {
    const stringCapitalized = str.toLowerCase();

    return stringCapitalized
      .split(' ')
      .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
      .join(' ');
  }
}
