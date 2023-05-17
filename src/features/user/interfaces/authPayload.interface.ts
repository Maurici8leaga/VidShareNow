// declarando una variable global, para poder usarla en diferentes files a al vez
declare global {
  // se hace una extencion de namespace Express el cual es un marco de trabajo de express
  namespace Express {
    // dentro del marco de trabajo estamos creando una nuevo parametro que no solia estar dentro de ella por defecto
    interface Request {
      //este sera un parametro custom para los request de express
      currentUser?: AuthPayload; //este parametro servira para autenticar el token del user
      //colocamos un parametro opcional para que sea de tipo AuthPayload que es otra interfaz
    }
  }
}

// DATO IMPORTANTE si se quiere hacer una variable global de express con una estructura de interfaz debe ir en el mismo file para que tenga el mismo scope

// se crea la interfaz con la estructura que tendra el parametro dentro de la interfaz global de express (SOLID Interface Segregation)
export interface AuthPayload {
  username: string;
  email: string;
  password: string;
  iat?: number; //es una palabra estandar que hace referencia al tiempo de expiracion del  token
}