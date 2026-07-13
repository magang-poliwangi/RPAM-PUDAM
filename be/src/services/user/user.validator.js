import Joi from "joi";

export const userPayloadValidatorPost = Joi.object({
    username: Joi.string()
        .min(4)
        .max(15)
        .pattern(/^[a-zA-Z0-9_-]+$/)
        .required()
        .messages({
            "string.base": "Username harus berupa teks.",
            "string.empty": "Username tidak boleh kosong.",
            "string.min": "Username minimal 4 karakter.",
            "string.max": "Username maksimal 15 karakter.",
            "string.pattern.base": "Username hanya boleh berisi huruf, angka, underscore (_) dan hyphen (-), tanpa spasi.",
            "any.required": "Username wajib diisi.",
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            "string.base": "Password harus berupa teks.",
            "string.empty": "Password tidak boleh kosong.",
            "string.min": "Password minimal 8 karakter.",
            "any.required": "Password wajib diisi.",
        }),
})

export const userPayloadValidatorPut = Joi.object({
    username: Joi.string()
        .min(4)
        .max(15)
        .pattern(/^[a-zA-Z0-9_-]+$/)
        .allow(null)
        .messages({
            "string.base": "Username harus berupa teks.",
            "string.empty": "Username tidak boleh kosong.",
            "string.min": "Username minimal 4 karakter.",
            "string.max": "Username maksimal 15 karakter.",
            "string.pattern.base": "Username hanya boleh berisi huruf, angka, underscore (_) dan hyphen (-), tanpa spasi.",
        }),
    password: Joi.string()
        .min(8)
        .allow(null)
        .messages({
            "string.base": "Password harus berupa teks.",
            "string.empty": "Password tidak boleh kosong.",
            "string.min": "Password minimal 8 karakter.",
        }),
})

export const userIdParamValidator = Joi.object({
    id: Joi.string().required()
}); 