import Joi from 'joi';

const createPemantauanOperasionalSchema = Joi.object({
    kajiUlangRisiko: Joi.string().required().messages({
        'any.required': 'Kaji ulang risiko (M4) wajib dipilih',
    }),
    batasKritis: Joi.string().allow('', null),
    apaYangDimonitor: Joi.string().required(),
    dimana: Joi.string().required(),
    kapan: Joi.string().required(),
    bagaimana: Joi.string().required(),
    siapaYangMelakukan: Joi.string().required(),
    siapaYangAkanMenganalisisHasilnya: Joi.string().required(),
    siapaYangMenerimaHasilAnalisisDanMengambilTindakan: Joi.string().required(),
    apaTindakanKoreksinya: Joi.string().required(),
    siapaYangMelakukanTindakanKoreksi: Joi.string().required(),
    seberapaCepat: Joi.string().required(),
    siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: Joi.string().required(),
});

const updatePemantauanOperasionalSchema = Joi.object({
    kajiUlangRisikoId: Joi.string(),
    batasKritis: Joi.string().allow('', null),
    apaYangDimonitor: Joi.string(),
    dimana: Joi.string(),
    kapan: Joi.string(),
    bagaimana: Joi.string(),
    siapaYangMelakukan: Joi.string(),
    siapaYangAkanMenganalisisHasilnya: Joi.string(),
    siapaYangMenerimaHasilAnalisisDanMengambilTindakan: Joi.string(),
    apaTindakanKoreksinya: Joi.string(),
    siapaYangMelakukanTindakanKoreksi: Joi.string(),
    seberapaCepat: Joi.string(),
    siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: Joi.string(),
}).min(1);

const listPemantauanOperasionalQuerySchema = Joi.object({
    search: Joi.string().allow(''),
    kajiUlangRisikoId: Joi.string(),
    sortBy: Joi.string()
        .valid('createdAt', 'updatedAt', 'apaYangDimonitor', 'kapan')
        .default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    cursor: Joi.string(),
    limit: Joi.number().integer().min(1).max(100).default(20),
});

const idParamSchema = Joi.object({
    id: Joi.string().required(),
});

export {
    createPemantauanOperasionalSchema,
    updatePemantauanOperasionalSchema,
    listPemantauanOperasionalQuerySchema,
    idParamSchema,
};