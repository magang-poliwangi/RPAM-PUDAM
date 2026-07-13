import Joi from 'joi';

export const authenticationPayloadValidatorPost = Joi.object({
  username: Joi.string().required().messages({
    "string.base": "Username harus berupa teks.",
    "string.empty": "Username tidak boleh kosong.",
    "any.required": "Username wajib diisi.",
  }),

  password: Joi.string().required().messages({
    "string.base": "Password harus berupa teks.",
    "string.empty": "Password tidak boleh kosong.",
    "any.required": "Password wajib diisi.",
  }),
});