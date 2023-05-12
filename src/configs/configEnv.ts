// Este file es para manejar de una forma organizadas las variables de entorno de la app BUENA PRACTICA
import dotenv from 'dotenv';

dotenv.config({});
// el metodo "config" de dotenv permite poder llamar las variables globales que se tengan en .el archivo .env y asi poder usarlas

class Config {
  // aqui iran toda las variables que existan en el file .env
  public NODE_ENV: string | undefined;
  // creamos las propiedad publicas porque queremos poder acceder a ellas en otros lugares
  public CLIENT_URL: string | undefined;
  public SERVER_PORT: string | undefined;
  public DATABASE_URL: string | undefined;

  // inicializando las variables
  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    // "process.env" es la que permite poder apuntar a esta variable
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.SERVER_PORT = process.env.SERVER_PORT;
    this.DATABASE_URL = process.env.DATABASE_URL;
  }

  // se crea un metodo publico para validar que estas variables de entorno no esten vacias
  // es  un metodo util de verificacion
  public validateConfigEnv(): void {
    //se coloca void porque esta funcion no devolvera  nada
    console.log(this); // esto va a retornar un arrays de stings con su key y valor
    for (const [key, value] of Object.entries(this)) {
      // "key" para los nombres de las variables, "value" el valor que contienen
      if (value === undefined) {
        // se active un error por si la variable esta vacia
        throw new Error(`Configuration ${key} is undefined`);
      }
    }
  }
}

//se crea la instancia de la clase
export const config: Config = new Config();
