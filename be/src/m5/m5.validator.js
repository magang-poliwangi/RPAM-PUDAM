import Joi from 'joi';

export const m5Schema = Joi.object({
  kajiUlangRisikoId: Joi.string().required().messages({
    'any.required': 'ID Kaji Ulang Risiko wajib diisi'
  }),
  rencanaPerbaikan: Joi.string().required(),
  penanggungJawab: Joi.string().required(),
  jadwal: Joi.string().required(),
  biaya: Joi.number().min(0).allow(null).optional(),
  sumberPembiayaan: Joi.string().allow('', null).optional(),
  statusKemajuan: Joi.string().valid('BELUM_MULAI', 'SEDANG_BERJALAN', 'SELESAI', 'TERTUNDA').required(),
  kendala: Joi.string().allow('', null).optional(),
  prioritas: Joi.string().valid('PENDEK', 'MENENGAH', 'PANJANG').required()
});
