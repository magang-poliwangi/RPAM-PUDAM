import Joi from 'joi';

export const m1Schema = Joi.object({
  lokasiSpamId: Joi.string().required().messages({
    'any.required': 'Kode Lokasi SPAM wajib diisi'
  }),
  komponenSpam: Joi.string().required().messages({ 'any.required': 'Komponen SPAM wajib diisi' }),
  kontaminasiX: Joi.string().required().messages({ 'any.required': 'Kontaminasi (X) wajib diisi' }),
  komponenSpamY: Joi.string().required().messages({ 'any.required': 'Komponen SPAM Y wajib diisi' }),
  penyebabZ: Joi.string().required().messages({ 'any.required': 'Penyebab (Z) wajib diisi' }),
  kejadianBahayaXYZ: Joi.string().required().messages({ 'any.required': 'Kejadian Bahaya wajib diisi' }),
  tipeBahaya: Joi.string().required().messages({ 'any.required': 'Tipe Bahaya wajib diisi' }),
});
