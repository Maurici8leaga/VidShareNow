import Joi, { ObjectSchema } from 'joi';

const commentScheme: ObjectSchema = Joi.object().keys({
  text: Joi.string().required().min(4).messages({
    'string.base': 'Text must be of type string',
    'string.min': 'Text is too short must be at least 4 characteres',
    'string.empty': 'Text is a required field'
  })
});

export { commentScheme };
