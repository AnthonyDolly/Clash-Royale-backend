import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3000),
  DEFAULT_LIMIT: Joi.number().default(10),
  CLASH_ROYALE_API_KEY: Joi.required(),
  CLASH_ROYALE_MAIL_API_KEY: Joi.required(),
  FROM_EMAIL: Joi.required(),
});
