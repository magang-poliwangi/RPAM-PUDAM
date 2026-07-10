import Joi from 'joi';

export const m4Schema = Joi.object({
  penilaianRisikoId: Joi.string().required().messages({
    'any.required': 'ID Penilaian Risiko wajib diisi'
  }),
  tindakanPengendalian: Joi.string().required(),
  referensi: Joi.string().allow('', null).optional(),
  validasi: Joi.string().valid('EFEKTIF', 'TIDAK_EFEKTIF', 'TIDAK_PASTI').required(),
  peluangSetelah: Joi.number().integer().min(1).max(5).required(),
  dampakSetelah: Joi.number().integer().min(1).max(5).required()
});
