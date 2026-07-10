import Joi from 'joi';

export const m2Schema = Joi.object({
  identifikasiBahayaId: Joi.string().required().messages({
    'any.required': 'ID Identifikasi Bahaya wajib diisi'
  }),
  peluangKejadianBahaya: Joi.number().integer().min(1).max(5).required().messages({
    'any.required': 'Peluang wajib diisi',
    'number.min': 'Peluang harus antara 1-5',
    'number.max': 'Peluang harus antara 1-5',
  }),
  dampakKeparahan: Joi.number().integer().min(1).max(5).required().messages({
    'any.required': 'Dampak wajib diisi',
    'number.min': 'Dampak harus antara 1-5',
    'number.max': 'Dampak harus antara 1-5',
  }),
});
