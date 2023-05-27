import Joi, { ObjectSchema } from 'joi';

// aqui se define la estructura del esquema para crear un video

// se crea un objeto de tipo ObjectSchema
const videoScheme: ObjectSchema = Joi.object().keys({
  // con "Joi.object()"se crea un objeto de joi y con "keys" se valida los keys de ese objeto

  // las siguientes son validaciones de los keys o propiedades del objeto, para asi asegurar que el usuario las llene correctamente
  title: Joi.string().required().min(5).messages({
    // con "required" especificamos que debe ir este parametro
    // messages es para colocar un mensaje si el usuario incumple uno de los parametros ya colocado anteriormente
    'string.base': 'Title must be of type string',
    // string.base es el tipo que debe ser ese string
    'string.min': 'The title is too short must be at least 5 characteres',
    'string.empty': 'Title is a required field'
  }),
  category: Joi.string().required().messages({
    'string.base': 'Category must be of type string',
    'string.empty': 'Category is a required field'
  }),
  link: Joi.string().required().uri().messages({
    'string.base': 'URL must be of type string',
    'string.uri': 'URL must be valid',
    'string.empty': 'URL is a required field'
  }),
  description: Joi.string().required().min(10).max(50).messages({
    'string.base': 'Description must be of type string',
    'string.min': 'Description is too short must be at least 10 characteres',
    // min es el numero minimo de characteres que tendra este parametro y max es el maximo
    'string.max': 'Description is too long must be at least 50 characteres',
    'string.empty': 'Description is a required field'
  })
});

export { videoScheme };
