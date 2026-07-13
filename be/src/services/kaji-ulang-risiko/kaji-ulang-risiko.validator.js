import Joi from 'joi';

export const kajiUlangRisikoPayloadValidatorPost = Joi.object({
    penilaianRisikoId: Joi.string().required().messages({
        'any.required': 'ID Penilaian Risiko wajib diisi',
        'string.empty': 'ID Penilaian Risiko tidak boleh kosong',
    }),
    tindakanPengendalian: Joi.string().required().messages({
        'any.required': 'Tindakan pengendalian wajib diisi',
        'string.empty': 'Tindakan pengendalian tidak boleh kosong',
    }),
    referensi: Joi.string().allow('', null).optional(),
    validasi: Joi.string().valid('EFEKTIF', 'TIDAK_EFEKTIF', 'TIDAK_PASTI').required().messages({
        'any.required': 'Validasi wajib diisi',
        'any.only': 'Validasi harus salah satu dari: EFEKTIF, TIDAK_EFEKTIF, TIDAK_PASTI',
    }),
    peluangSetelah: Joi.number().integer().min(1).max(5).required().messages({
        'any.required': 'Peluang setelah wajib diisi',
        'number.min': 'Peluang setelah minimal 1',
        'number.max': 'Peluang setelah maksimal 5',
    }),
    dampakSetelah: Joi.number().integer().min(1).max(5).required().messages({
        'any.required': 'Dampak setelah wajib diisi',
        'number.min': 'Dampak setelah minimal 1',
        'number.max': 'Dampak setelah maksimal 5',
    }),
});

export const kajiUlangRisikoPayloadValidatorPut = Joi.object({
    penilaianRisikoId: Joi.string().optional().messages({
        'string.empty': 'ID Penilaian Risiko tidak boleh kosong',
    }),
    tindakanPengendalian: Joi.string().optional().messages({
        'string.empty': 'Tindakan pengendalian tidak boleh kosong',
    }),
    referensi: Joi.string().allow('', null).optional(),
    validasi: Joi.string().valid('EFEKTIF', 'TIDAK_EFEKTIF', 'TIDAK_PASTI').optional().messages({
        'any.only': 'Validasi harus salah satu dari: EFEKTIF, TIDAK_EFEKTIF, TIDAK_PASTI',
    }),
    peluangSetelah: Joi.number().integer().min(1).max(5).optional().messages({
        'number.min': 'Peluang setelah minimal 1',
        'number.max': 'Peluang setelah maksimal 5',
    }),
    dampakSetelah: Joi.number().integer().min(1).max(5).optional().messages({
        'number.min': 'Dampak setelah minimal 1',
        'number.max': 'Dampak setelah maksimal 5',
    }),
});

export const kajiUlangRisikoIdParamValidator = Joi.object({
    id: Joi.string().required(),
});
