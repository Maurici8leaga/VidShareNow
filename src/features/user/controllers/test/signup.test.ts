import { Request, Response } from 'express';
import { authMockRequest, authMockResponse, IJWT } from '@root/shared/mocks/user.mock';
import { Signup } from '../signup';
import { CustomError } from '@helpers/errors/customError';
import { userService } from '@root/shared/services/db/user.service';

jest.useFakeTimers(); // es un observador que controla procesos y tiempos de ejecucion
jest.mock('@root/shared/services/db/user.service'); //simula un modulo que se encuentren en cierto directorio con sus caracteristicas en este caso el file que se  le  pasa en la ruta
// OJO DEBE IR PARA QUE SEPA LOS PROCESOS DE LA DB

// "describe" es el titulo del test, de lo que vas a testear, el 1er parametro sera el nombre, el 2do es va ser un callback
describe('SignUp', () => {
  beforeEach(() => {
    // el beforeEach es para  ejecutar funciones antes de arrancar cada test, en este caso para limpiar los test anteriores
    jest.resetAllMocks();
    // resettAllMocks , borra otros test que se hallan ejecutado antes, para que no se ejecuten otros test y no cree otros mocks aparte del que estas ejecutando
    // SIEMPRE SE DEBE LIMPIAR LOS MOCKS
  });

  afterEach(() => {
    // el "afterEach" es para ejecuciones que se realizan una vez que se ha resuelto el test
    jest.clearAllMocks(); //despues de cada ejecucion de test este ayuda a limpiar los datos ocupados de otros mocks
    jest.clearAllTimers(); //Limpia los procesos de escucha de los observadores de ejecucion
  });

  // UNITART TEST
  it('it should throw a error if the password is not provided', async () => {
    // el "it" describes que es lo que se va a testear y como se va a hacer, su 1er  parametro es el nombre del test, el 2do
    // sera un callback el cual sera el test

    // GIVEN STEP
    const req: Request = authMockRequest(
      //este "authMockRequest" es una abstraccion de codigo que viene de auth.mocks donde en el
      // se especificaron los parametros con sus valores, de esta forma se implementa el patron de diseño

      {}, //el token es un json por ende es un objeto vacio que se coloca
      {
        username: 'lulu3434',
        email: 'lulu@gmail.com',
        password: ''
      }
    ) as Request;

    const res: Response = authMockResponse(); //este "authMockResponse" es una abstraccion de codigo que viene de auth.mocks donde en el
    // se especificaron los parametros con sus valores, de esta forma se implementa el patron de diseño

    // WHEN STEP
    await Signup.prototype.create(req, res).catch((error: CustomError) => {
      // el create es un promise por eso se usa "catch" ya que sabemos que retornara un error
      // en el signup se debe prototypar igual para poder ser implementado

      // THEN STEP: ASSERT

      // ya que en el signup se espera enviar un status y un mensaje (json) entonces se debe hacer..
      expect(error.statuscode).toEqual(400); //se envia el status esperado
      expect(error.serializeErrors().message).toEqual('Password is a required field'); //se envia el mensaje esperado, OJO DEBE SER EL MISMO SI NO DARA ERROR
    });
  });

  // INTEGRATION TEST2
  it('Should create user successfully', async () => {
    // GIVEN STEP
    const req: Request = authMockRequest(
      {},
      {
        username: 'edu5656',
        email: 'edu@gmail.com',
        password: '123456'
      }
    ) as Request;

    const res: Response = authMockResponse();

    // const { username, email, password } = req.body;

    // const usernameFix = await Generators.firstLetterCapitalized(username);
    // // const hashPassword = await Generators.hash(password);

    // const userData = {
    //   // _id:  new ObjectId(),
    //   username: usernameFix,
    //   email,
    //   // password: hashPassword,
    //   password,
    //   createdAt: new Date()
    // };

    // WHEN STEP
    jest.spyOn(userService, 'getUserByUsernameOrEmail').mockResolvedValue(null!); //se pasa null para simular que no existe en la DB

    const userSpy = jest.spyOn(userService, 'createUser');
    // jest.spyOn(userService, 'createUser'); <- ANTES

    // const userData = jest.spyOn(userService, 'createUser');

    // const user = {
    //   _id: '64769460fe2ef6ffc89123df',
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: req.body.password
    // };

    await Signup.prototype.create(req, res);

    // THEN STEP
    expect(req.session?.token as IJWT).toBeDefined(); //"toBeDefined" es para asegurar que el valor de ua variable no sea undefined
    expect(res.status).toHaveBeenCalledWith(201); // "toHaveBeenCalledWidth" es para asegurarse que los parametros de una funcion venga con todos sus valores
    console.log(userSpy.mock, 'esto es userSpy');
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: userSpy.mock.calls[0][0], //"calls"  Permite apuntar a argumentos de un mock generado OJO REVISAR PRIMERO EL LENGTH DEL CALLS
      // user: userSpy.mock.calls[0][0],
      token: req.session?.token
    });
  });
});
