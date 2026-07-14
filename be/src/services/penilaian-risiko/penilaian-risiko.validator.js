import Joi from 'joi';
export const penilaianRisikoPayloadValidatorPost = Joi.object({
    identifikasiBahayaId: Joi.string().required().messages({
        'any.required': 'ID identifikasi bahaya wajib diisi',
        'string.empty': 'ID identifikasi bahaya tidak boleh kosong',
    }),
    peluangKejadianBahaya: Joi.number().integer().min(1).max(5).required().messages({
        'any.required': 'Peluang kejadian bahaya wajib diisi',
        'number.min': 'Peluang kejadian bahaya minimal 1',
        'number.max': 'Peluang kejadian bahaya maksimal 5',
    }),
    dampakKeparahan: Joi.number().integer().min(1).max(5).required().messages({
        'any.required': 'Dampak keparahan wajib diisi',
        'number.min': 'Dampak keparahan minimal 1',
        'number.max': 'Dampak keparahan maksimal 5',
    }),
});

export const penilaianRisikoPayloadValidatorPut = Joi.object({
    peluangKejadianBahaya: Joi.number().integer().min(1).max(5).optional().messages({
        'number.min': 'Peluang kejadian bahaya minimal 1',
        'number.max': 'Peluang kejadian bahaya `maksimal 5',
    }),
    dampakKeparahan: Joi.number().integer().min(1).max(5).optional().messages({
        'number.min': 'Dampak keparahan minimal 1',
        'number.max': 'Dampak keparahan maksimal 5',
    }),
}).min(1).messages({
    'object.min': 'Minimal satu field harus diisi untuk memperbarui data',
});

export const penilaianRisikoIdParamValidator = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'ID penilaian risiko wajib diisi',
        'string.empty': 'ID penilaian risiko tidak boleh kosong',
    }),
});