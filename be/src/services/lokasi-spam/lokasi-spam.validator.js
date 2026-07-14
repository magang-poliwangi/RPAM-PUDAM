import Joi from "joi";

const nullableString = Joi.string()
    .empty("")
    .default(null)
    .allow(null)
    .messages({
        "string.base": "Field harus berupa teks",
    });

export const lokasiSpamPayloadValidatorPost = Joi.object({
    kodeLokasi: Joi.string().required().messages({
        "any.required": "Kode lokasi wajib diisi",
        "string.empty": "Kode lokasi tidak boleh kosong",
    }),

    simbol: nullableString,
    namaLokasi: nullableString,
    deskripsi: nullableString,
    penanggungJawabNama: nullableString,
    penanggungJawabPosisi: nullableString,
    penanggungJawabTelepon: nullableString,
    penanggungJawabEmail: nullableString,
    referensi: nullableString,
});

export const lokasiSpamPayloadValidatorPut = Joi.object({
    kodeLokasi: Joi.string().messages({
        "string.empty": "Kode lokasi tidak boleh kosong",
    }),

    simbol: nullableString,
    namaLokasi: nullableString,
    deskripsi: nullableString,
    penanggungJawabNama: nullableString,
    penanggungJawabPosisi: nullableString,
    penanggungJawabTelepon: nullableString,
    penanggungJawabEmail: nullableString,
    referensi: nullableString,
})
.min(1)
.messages({
    "object.min": "Minimal satu field harus diisi untuk memperbarui data",
});

export const lokasiSpamIdParamValidator = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "ID lokasi SPAM wajib diisi",
        "string.empty": "ID lokasi SPAM tidak boleh kosong",
    }),
});