import Joi from 'joi';

export const pemantauanOperasionalPayloadValidatorPost = Joi.object({
    kajiUlangRisikoId: Joi.string().required().messages({
        'any.required': 'Kaji ulang risiko  wajib dipilih',
        'string.empty': 'Kaji ulang risiko  tidak boleh kosong',
    }),
    batasKritis: Joi.string().allow('', null).optional(),
    apaYangDimonitor: Joi.string().required().messages({
        'any.required': 'Apa yang dimonitor wajib diisi',
        'string.empty': 'Apa yang dimonitor tidak boleh kosong',
    }),
    dimana: Joi.string().required().messages({
        'any.required': 'Lokasi (dimana) wajib diisi',
        'string.empty': 'Lokasi (dimana) tidak boleh kosong',
    }),
    kapan: Joi.string().required().messages({
        'any.required': 'Waktu (kapan) wajib diisi',
        'string.empty': 'Waktu (kapan) tidak boleh kosong',
    }),
    bagaimana: Joi.string().required().messages({
        'any.required': 'Cara pemantauan (bagaimana) wajib diisi',
        'string.empty': 'Cara pemantauan (bagaimana) tidak boleh kosong',
    }),
    siapaYangMelakukan: Joi.string().required().messages({
        'any.required': 'Penanggung jawab pemantauan wajib diisi',
        'string.empty': 'Penanggung jawab pemantauan tidak boleh kosong',
    }),
    siapaYangAkanMenganalisisHasilnya: Joi.string().required().messages({
        'any.required': 'Penganalisis hasil wajib diisi',
        'string.empty': 'Penganalisis hasil tidak boleh kosong',
    }),
    siapaYangMenerimaHasilAnalisisDanMengambilTindakan: Joi.string().required().messages({
        'any.required': 'Penerima hasil analisis wajib diisi',
        'string.empty': 'Penerima hasil analisis tidak boleh kosong',
    }),
    apaTindakanKoreksinya: Joi.string().required().messages({
        'any.required': 'Tindakan koreksi wajib diisi',
        'string.empty': 'Tindakan koreksi tidak boleh kosong',
    }),
    siapaYangMelakukanTindakanKoreksi: Joi.string().required().messages({
        'any.required': 'Pelaksana tindakan koreksi wajib diisi',
        'string.empty': 'Pelaksana tindakan koreksi tidak boleh kosong',
    }),
    seberapaCepat: Joi.string().required().messages({
        'any.required': 'Kecepatan tindakan (seberapa cepat) wajib diisi',
        'string.empty': 'Kecepatan tindakan (seberapa cepat) tidak boleh kosong',
    }),
    siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: Joi.string().required().messages({
        'any.required': 'Penerima laporan tindakan koreksi wajib diisi',
        'string.empty': 'Penerima laporan tindakan koreksi tidak boleh kosong',
    }),
});

export const pemantauanOperasionalPayloadValidatorPut = Joi.object({
    kajiUlangRisikoId: Joi.string().optional().messages({
        'string.empty': 'Kaji ulang risiko (M4) tidak boleh kosong',
    }),
    batasKritis: Joi.string().allow('', null).optional(),
    apaYangDimonitor: Joi.string().optional().messages({
        'string.empty': 'Apa yang dimonitor tidak boleh kosong',
    }),
    dimana: Joi.string().optional().messages({
        'string.empty': 'Lokasi (dimana) tidak boleh kosong',
    }),
    kapan: Joi.string().optional().messages({
        'string.empty': 'Waktu (kapan) tidak boleh kosong',
    }),
    bagaimana: Joi.string().optional().messages({
        'string.empty': 'Cara pemantauan (bagaimana) tidak boleh kosong',
    }),
    siapaYangMelakukan: Joi.string().optional().messages({
        'string.empty': 'Penanggung jawab pemantauan tidak boleh kosong',
    }),
    siapaYangAkanMenganalisisHasilnya: Joi.string().optional().messages({
        'string.empty': 'Penganalisis hasil tidak boleh kosong',
    }),
    siapaYangMenerimaHasilAnalisisDanMengambilTindakan: Joi.string().optional().messages({
        'string.empty': 'Penerima hasil analisis tidak boleh kosong',
    }),
    apaTindakanKoreksinya: Joi.string().optional().messages({
        'string.empty': 'Tindakan koreksi tidak boleh kosong',
    }),
    siapaYangMelakukanTindakanKoreksi: Joi.string().optional().messages({
        'string.empty': 'Pelaksana tindakan koreksi tidak boleh kosong',
    }),
    seberapaCepat: Joi.string().optional().messages({
        'string.empty': 'Kecepatan tindakan (seberapa cepat) tidak boleh kosong',
    }),
    siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: Joi.string().optional().messages({
        'string.empty': 'Penerima laporan tindakan koreksi tidak boleh kosong',
    }),
}).min(1).messages({
    'object.min': 'Minimal satu field harus diisi untuk memperbarui data',
});

// export const pemantauanOperasionalQueryValidatorGet = Joi.object({
//     search: Joi.string().allow('').optional(),
//     kajiUlangRisikoId: Joi.string().optional(),
//     sortBy: Joi.string()
//         .valid('createdAt', 'updatedAt', 'apaYangDimonitor', 'kapan')
//         .default('createdAt')
//         .messages({
//             'any.only': 'sortBy harus salah satu dari: createdAt, updatedAt, apaYangDimonitor, kapan',
//         }),
//     sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
//         'any.only': 'sortOrder harus salah satu dari: asc, desc',
//     }),
//     cursor: Joi.string().optional(),
//     limit: Joi.number().integer().min(1).max(100).default(20).messages({
//         'number.min': 'limit minimal 1',
//         'number.max': 'limit maksimal 100',
//     }),
// });

export const pemantauanOperasionalIdParamValidator = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'ID pemantauan operasional wajib diisi',
        'string.empty': 'ID pemantauan operasional tidak boleh kosong',
    }),
});