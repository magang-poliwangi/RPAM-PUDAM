import Joi from 'joi';

export const identifikasiBahayaPayloadValidatorPost = Joi.object({
    lokasiSpamId: Joi.string().required().messages({
        'any.required': 'Lokasi SPAM wajib dipilih',
        'string.empty': 'Lokasi SPAM tidak boleh kosong',
    }),
    kodeRisiko: Joi.string().required().messages({
        'any.required': 'Kode risiko wajib diisi',
        'string.empty': 'Kode risiko tidak boleh kosong',
    }),
    komponenSpam: Joi.string().required().messages({
        'any.required': 'Komponen SPAM wajib diisi',
        'string.empty': 'Komponen SPAM tidak boleh kosong',
    }),
    kontaminasiX: Joi.string().required().messages({
        'any.required': 'Kontaminasi (X) wajib diisi',
        'string.empty': 'Kontaminasi (X) tidak boleh kosong',
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
    tipeBahaya: Joi.string().required().messages({
        'any.required': 'Tipe bahaya wajib diisi',
        'string.empty': 'Tipe bahaya tidak boleh kosong',
    }),
});

export const identifikasiBahayaPayloadValidatorPut = Joi.object({
    lokasiSpamId: Joi.string().optional().messages({
        'string.empty': 'Lokasi SPAM tidak boleh kosong',
    }),
    kodeRisiko: Joi.string().optional().messages({
        'string.empty': 'Kode risiko tidak boleh kosong',
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
    tipeBahaya: Joi.string().optional().messages({
        'string.empty': 'Tipe bahaya tidak boleh kosong',
    }),
}).min(1);

export const identifikasiBahayaIdParamValidator = Joi.object({
    id: Joi.string().required(),
});