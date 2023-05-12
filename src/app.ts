import express, { Express } from 'express';
import { VidShareNowServer } from '@bootstrap/setupServer.bootstrap';
import databaseConnection from '@bootstrap/setupDatabase.bootstrap';
// "databaseConnection" Es el nombre que se le coloca a la funcion anonima
import { config } from '@configs/configEnv';

class Application {
  public initialize(): void {
    // llamamos el metodo privado para que cuando se ejecute "initialize" este sea ejecutado
    this.loadConfig();
    // llamamos la funcion de arranque del db
    databaseConnection();

    const app: Express = express(); //aqui se le otorga a "app" los metodos de express
    //se crea una instancia del class VidShareNowServer, para poder arrancar el server
    const server: VidShareNowServer = new VidShareNowServer(app);
    server.start(); //se usa el metodo start de la clase VidShareNowServer para iniciar los metodos
  }

  // este es un metodo privado para que ejecute metodos al iniciar la app
  private loadConfig(): void {
    config.validateConfigEnv(); //metodo para verificacion de la variables de entorno
  }
}

// se debe crea la instancia del class
const application: Application = new Application();
application.initialize(); // hacemos llamado del metodo "initialize" para terminar de arrancar el server
