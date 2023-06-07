import Joi, { ObjectSchema } from 'joi';

const videoScheme: ObjectSchema = Joi.object().keys({
  title: Joi.string().required().min(5).messages({
    'string.base': 'Title must be of type string',
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
    'string.max': 'Description is too long must be at least 50 characteres',
    'string.empty': 'Description is a required field'
  })
});

export { videoScheme };
