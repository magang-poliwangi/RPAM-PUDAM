import Joi from 'joi';

export const m6Schema = Joi.object({
  kajiUlangRisikoId: Joi.string().required().messages({
    'any.required': 'ID Kaji Ulang Risiko wajib diisi'
  }),
  batasKritis: Joi.string().allow('', null).optional(),
  apaYangDimonitor: Joi.string().required(),
  dimana: Joi.string().required(),
  kapan: Joi.string().required(),
  bagaimana: Joi.string().required(),
  siapaYangMelakukan: Joi.string().required(),
  siapaYangAkanMenganalisisHasilnya: Joi.string().allow('', null).optional(),
  siapaYangMenerimaHasilAnalisisDanMengambilTindakan: Joi.string().allow('', null).optional(),
  apaTindakanKoreksinya: Joi.string().allow('', null).optional(),
  siapaYangMelakukanTindakanKoreksi: Joi.string().allow('', null).optional(),
  seberapaCepat: Joi.string().allow('', null).optional(),
  siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: Joi.string().allow('', null).optional(),
});
