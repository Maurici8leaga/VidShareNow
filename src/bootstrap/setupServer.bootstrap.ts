// Aqui va todo lo referente a las configuracion del server y de la inicializacion del mismo
import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import http from 'http';
import Logger from 'bunyan';
import { config } from '@configs/configEnv';
import { logger } from '@configs/configLogs';

//creamos el logger para los logs de este class
const log: Logger = logger.createLogger('Server');
// "Server" es el nombre de referencia que se le dara a los logs que provengan de este class

export class VidShareNowServer {
  private app: Application;

  //se inicializa la propiedad
  constructor(app: Application) {
    this.app = app;
  }

  // se crea un metodo publico para se ejecute cuando sea invocado start
  public start(): void {
    this.startServer(this.app);
  }

  // metodo de arranque asincrono del servidor de node
  private async startServer(app: Application): Promise<void> {
    try {
      //se crea una instancia de http.Server
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer); //se iniciliza el metodo para el arranque del servidor http
    } catch (error) {
      log.error(error); // los logger de tipo "error" son para mostrar errores , alertas, warning
    }
  }

  // metodo privado para arranque del servidor http
  private startHttpServer(httpServer: http.Server): void {
    const PORT = Number(config.SERVER_PORT);
    // se usa Number para convertir el valor de la variable "SERVER_PORT" en numero ya que process.env acepta solo strings

    // "http.Serve" es una clase de node js que permite crear un servidor http
    httpServer.listen(PORT, () => {
      // el metodo listen necesita 2 parametros, el 1ro es el numero de puerto en el que va a trabajar el servidor y el
      // 2do es un callback el cual puede mostrar algo

      log.info(`Server has started with process ${process.pid}`); //se usa logger en vez de consol.log para asi tener mejor trazabilidad
      // se debe mandar un mensaje al terminal para indicar que el server esta OK

      log.info(`Server running at ${PORT}`); //los logger de tipo "info" son para entregar mensajes de anuncios
    });
  }
}
