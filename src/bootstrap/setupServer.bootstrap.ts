// Aqui va todo lo referente a las configuracion del server y de la inicializacion del mismo
import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import http from 'http';
import Logger from 'bunyan';
import cookieSession from 'cookie-session';
// para la manejar la autenticacion en la bd del usuario
import hpp from 'hpp';
// para seguridad de ataques a las rutas xss
import helmet from 'helmet';
// para seguridad al server cuando la data navega por internet
import cors from 'cors';
// "cors" para comunicacion de dominios
import compression from 'compression';
// para comprimir a lo mas minimo la info que va y llega del server
import HTTP_STATUS from 'http-status-codes';
// para usar los status code en los errors
import { config } from '@configs/configEnv';
import { logger } from '@configs/configLogs';
import { IErrorResponse } from '@helpers/errors/errorResponse.interface';
import { CustomError } from '@helpers/errors/customError';
import applicationRoutes from '@interfaces/http/routes';

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
    // al arrancar seran ejecutados estos metodos privados que manejan los middleware
    // aqui se aplica el patron chains of responsability
    this.securityMiddleware(this.app);
    this.standarmiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  // metodo privado para los middlewares de seguridad
  // aqui se aplica Design pattern Synchronizer Token Pattern: https://medium.com/@kaviru.mihisara/synchronizer-token-pattern-e6b23f53518e
  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        //middleware para los cookies
        name: 'session', //el nombre que va a tener de referencia la cookie
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!], // es donde van las credenciales de lasa cookies, se coloca el signo ! para el required
        maxAge: 2 * 24 * 60 * 60 * 1000, // se coloca un calculo de dias, semanas,  horas de cuanto va a durar la cookie, en este caso 2 dias
        secure: config.NODE_ENV !== 'develoment' //es donde se especifica el contexto en el que se va trabajar
      })
    );

    app.use(hpp()); //middleware para proteger las rutas
    app.use(helmet()); //middleware para proteger la info cuando va desde y hacia el server
    app.use(
      cors({
        origin: config.CLIENT_URL, // se coloca la direccion URL de origen del cliente, o * si se quiere dejar abierta
        credentials: true, // config obligatoria,  para producción para credentials en ambientes cloud
        optionsSuccessStatus: 200, //codigo de respuesta de solicitud http
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // metodos explicitos que se van a utilizar
      })
    );
  }

  // metodo privado para los estandares de los middlewares
  private standarmiddleware(app: Application): void {
    app.use(compression()); //"compression" para comprimir la data
    app.use(json({ limit: '50mb' })); //se le pasa como parametro adicional el peso maximo que debe tener estos archivos
    // se usa "json()" para parsear el contenido del server ya que ya no se usa "bodyParser.json()"
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    // el "urlencoded" asegura que el formato venga  en el que se indico en este caso tipo "json"
    // el parametro "extended" encripta la data que venga en el archivo
    // y como 2do parametro se le pasa "limit" para que el peso del archivo no supere del indicado
    // el "urlencoded" asegura que el formato venga  en el que se indico en este caso tipo "json"
    // el parametro "extended" encripta la data que venga en el archivo
    // y como 2do parametro se le pasa "limit" para que el peso del archivo no supere del indicado
  }

  // metodo privado para las exponer las rutas y que se puedan acceder apenas arranque el server
  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  // metodo privado para manejor de los errores globales
  private globalErrorHandler(app: Application) {
    // este middleware es para las rutas que no existan
    app.all('*', (req: Request, res: Response) => {
      // app.all("*") para todas las rutas en express el * tomará todas las definiciones a partir de las rutas que existentes cuando definas tus rutas de la app.. entonces a partir de las creadas, tomará las que no esten
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
      // esto mandara con un status 404 y un mensaaje con la ruta a la que se esta tratando de acceder diciendo not found
    });

    // este middleware es para las rutas que si existan
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      // el "_" del req se coloca ya que es un parametro que debe ir pero no es usado
      // aqui se usa la interfaz "IErrorResponse" para el manejo del mensaje del error

      log.error(error); // se coloca un log para tener la trazabilidad del error
      if (error instanceof CustomError) {
        // se usa el "instanceof" para verificar que si el error es de clase "CustomError" entonces haga..

        return res.status(error.statusCode).json(error.serializeErrors());
        // se va a enviar el status code con un json de estructura del "serializeErrors"
      }
      next(); // se llama next para que si termino el proceso salte a otro proceso
    });
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
