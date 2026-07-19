import Joi from "joi";

export const bahayaKontaminasiPayloadValidatorPost = Joi.object({
    kodeRisiko: Joi.string().messages({
        "string.empty": " tidak boleh kosong",
    }),
    kontaminasiX: Joi.string().messages({
        "string.empty": " tidak boleh kosong",
    }),
    tipeBahaya: Joi.string().messages({
        "string.empty": " tidak boleh kosong",
    }),

});

export const bahayaKontaminasiPayloadValidatorPut = Joi.object({
    kodeRisiko: Joi.string().messages({
        "string.empty": " tidak boleh kosong",
    }),
    kontaminasiX: Joi.string().messages({
        "string.empty": " tidak boleh kosong",
    }),
    tipeBahaya: Joi.string().messages({
        "string.empty": " tidak boleh kosong",
    }),
})


export const bahayaKontaminasiIdParamValidator = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "ID Bahaya Kontaminasi wajib diisi",
        "string.empty": "ID Bahaya Kontaminasi tidak boleh kosong",
    }),
});