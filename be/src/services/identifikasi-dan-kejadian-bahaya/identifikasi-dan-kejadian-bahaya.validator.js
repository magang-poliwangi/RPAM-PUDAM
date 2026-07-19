import Joi from 'joi';

export const identifikasiBahayaPayloadValidatorPost = Joi.object({
    lokasiSpamId: Joi.string().required().messages({
        'any.required': 'Lokasi SPAM wajib dipilih',
        'string.empty': 'Lokasi SPAM tidak boleh kosong',
    }),
    bahayaKontaminasiId: Joi.string().required().messages({
        'any.required': 'Bahaya Kontaminasi wajib diisi',
        'string.empty': 'Bahaya Kontaminasi tidak boleh kosong',
    }),
    komponenSpam: Joi.string().required().messages({
        'any.required': 'Komponen SPAM wajib diisi',
        'string.empty': 'Komponen SPAM tidak boleh kosong',
    }),
    komponenSpamY: Joi.string().required().messages({
        'any.required': 'Komponen SPAM (Y) wajib diisi',
        'string.empty': 'Komponen SPAM (Y) tidak boleh kosong',
    }),
    penyebabZ: Joi.string().required().messages({
        'any.required': 'Penyebab (Z) wajib diisi',
        'string.empty': 'Penyebab (Z) tidak boleh kosong',
    }),
    kejadianBahayaXYZ: Joi.string().required().messages({
        'any.required': 'Kejadian bahaya (XYZ) wajib diisi',
        'string.empty': 'Kejadian bahaya (XYZ) tidak boleh kosong',
    }),
});

export const identifikasiBahayaPayloadValidatorPut = Joi.object({
    lokasiSpamId: Joi.string().optional().messages({
        'string.empty': 'Lokasi SPAM tidak boleh kosong',
    }),
    bahayaKontaminasiId: Joi.string().optional().messages({
        'string.empty': 'Bahaya Kontaminasi tidak boleh kosong',
    }),
    komponenSpam: Joi.string().optional().messages({
        'string.empty': 'Komponen SPAM tidak boleh kosong',
    }),
    kontaminasiX: Joi.string().optional().messages({
        'string.empty': 'Kontaminasi (X) tidak boleh kosong',
    }),
    komponenSpamY: Joi.string().optional().messages({
        'string.empty': 'Komponen SPAM (Y) tidak boleh kosong',
    }),
    penyebabZ: Joi.string().optional().messages({
        'string.empty': 'Penyebab (Z) tidak boleh kosong',
    }),
    kejadianBahayaXYZ: Joi.string().optional().messages({
        'string.empty': 'Kejadian bahaya (XYZ) tidak boleh kosong',
    }),
}).min(1);

export const identifikasiBahayaIdParamValidator = Joi.object({
    id: Joi.string().required(),
});