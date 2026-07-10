import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username wajib diisi',
    'string.empty': 'Username tidak boleh kosong'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password wajib diisi',
    'string.empty': 'Password tidak boleh kosong'
  })
});
