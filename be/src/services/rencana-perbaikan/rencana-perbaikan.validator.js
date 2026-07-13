import Joi from 'joi';

export const rencanaPerbaikanPayloadValidatorPost = Joi.object({
    kajiUlangRisikoId: Joi.string().required().messages({
        'any.required': 'ID Kaji Ulang Risiko wajib diisi',
        'string.empty': 'ID Kaji Ulang Risiko tidak boleh kosong',
    }),
    rencanaPerbaikan: Joi.string().required().messages({
        'any.required': 'Rencana perbaikan wajib diisi',
        'string.empty': 'Rencana perbaikan tidak boleh kosong',
    }),
    penanggungJawab: Joi.string().required().messages({
        'any.required': 'Penanggung jawab wajib diisi',
        'string.empty': 'Penanggung jawab tidak boleh kosong',
    }),
    jadwal: Joi.string().required().messages({
        'any.required': 'Jadwal wajib diisi',
        'string.empty': 'Jadwal tidak boleh kosong',
    }),
    biaya: Joi.number().min(0).allow(null).optional().messages({
        'number.min': 'Biaya tidak boleh negatif',
    }),
    sumberPembiayaan: Joi.string().allow('', null).optional(),
    statusKemajuan: Joi.string()
        .valid('BELUM_MULAI', 'SEDANG_BERJALAN', 'SELESAI', 'TERTUNDA')
        .required()
        .messages({
            'any.required': 'Status kemajuan wajib diisi',
            'any.only': 'Status kemajuan harus salah satu dari: BELUM_MULAI, SEDANG_BERJALAN, SELESAI, TERTUNDA',
        }),
    kendala: Joi.string().allow('', null).optional(),
    prioritas: Joi.string().valid('PENDEK', 'MENENGAH', 'PANJANG').required().messages({
        'any.required': 'Prioritas wajib diisi',
        'any.only': 'Prioritas harus salah satu dari: PENDEK, MENENGAH, PANJANG',
    }),
});

export const rencanaPerbaikanPayloadValidatorPut = Joi.object({
    kajiUlangRisikoId: Joi.string().optional().messages({
        'string.empty': 'ID Kaji Ulang Risiko tidak boleh kosong',
    }),
    rencanaPerbaikan: Joi.string().optional().messages({
        'string.empty': 'Rencana perbaikan tidak boleh kosong',
    }),
    penanggungJawab: Joi.string().optional().messages({
        'string.empty': 'Penanggung jawab tidak boleh kosong',
    }),
    jadwal: Joi.string().optional().messages({
        'string.empty': 'Jadwal tidak boleh kosong',
    }),
    biaya: Joi.number().min(0).allow(null).optional().messages({
        'number.min': 'Biaya tidak boleh negatif',
    }),
    sumberPembiayaan: Joi.string().allow('', null).optional(),
    statusKemajuan: Joi.string()
        .valid('BELUM_MULAI', 'SEDANG_BERJALAN', 'SELESAI', 'TERTUNDA')
        .optional()
        .messages({
            'any.only': 'Status kemajuan harus salah satu dari: BELUM_MULAI, SEDANG_BERJALAN, SELESAI, TERTUNDA',
        }),
    kendala: Joi.string().allow('', null).optional(),
    prioritas: Joi.string().valid('PENDEK', 'MENENGAH', 'PANJANG').optional().messages({
        'any.only': 'Prioritas harus salah satu dari: PENDEK, MENENGAH, PANJANG',
    }),
});

export const rencanaPerbaikanIdParamValidator = Joi.object({
    id: Joi.string().required(),
});
