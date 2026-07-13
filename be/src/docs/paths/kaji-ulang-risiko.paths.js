const KAJI_TAG = ['Kaji Ulang Risiko'];
const KAJI_SECURITY = [{ BearerAuth: [] }];

const listResponse = {
    description: 'Data berhasil diambil',
    content: {
        'application/json': {
            schema: {
                allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                        type: 'object',
                        properties: {
                            data: {
                                type: 'object',
                                properties: {
                                    items: { type: 'array', items: { $ref: '#/components/schemas/KajiUlangRisiko' } },
                                    pagination: { $ref: '#/components/schemas/Pagination' },
                                },
                            },
                        },
                    },
                ],
            },
        },
    },
};

const singleResponse = {
    description: 'Data berhasil diambil',
    content: {
        'application/json': {
            schema: {
                allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/KajiUlangRisiko' } },
                    },
                ],
            },
        },
    },
};

const errorResponses = {
    400: { description: 'Validasi gagal', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
    401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
    404: { description: 'Data tidak ditemukan', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
    409: { description: 'Data untuk penilaian risiko ini sudah ada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
};

const idParam = { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID Kaji Ulang Risiko' };
const queryParams = [
    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Halaman' },
    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 }, description: 'Jumlah data per halaman' },
    { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Cari berdasarkan tindakan pengendalian' },
    { in: 'query', name: 'sortBy', schema: { type: 'string', default: 'createdAt' }, description: 'Field untuk sorting' },
    { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }, description: 'Arah sorting' },
];

export const kajiUlangRisikoPaths = {
    '/api/kaji-ulang-risiko': {
        post: {
            tags: KAJI_TAG,
            summary: 'Buat data kaji ulang risiko',
            description: 'Membuat data kaji ulang risiko baru. Setiap penilaian risiko hanya boleh memiliki satu kaji ulang.',
            security: KAJI_SECURITY,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateKajiUlangRisikoRequest' },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Data berhasil ditambahkan',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/ApiResponse' },
                                    {
                                        type: 'object',
                                        properties: { data: { $ref: '#/components/schemas/KajiUlangRisiko' } },
                                    },
                                ],
                            },
                        },
                    },
                },
                400: errorResponses[400],
                401: errorResponses[401],
                409: errorResponses[409],
            },
        },
        get: {
            tags: KAJI_TAG,
            summary: 'Dapatkan semua data kaji ulang risiko',
            description: 'Mengembalikan daftar kaji ulang risiko dengan pagination dan pencarian.',
            security: KAJI_SECURITY,
            parameters: queryParams,
            responses: {
                200: listResponse,
                401: errorResponses[401],
            },
        },
    },
    '/api/kaji-ulang-risiko/{id}': {
        get: {
            tags: KAJI_TAG,
            summary: 'Dapatkan kaji ulang risiko berdasarkan ID',
            security: KAJI_SECURITY,
            parameters: [idParam],
            responses: {
                200: singleResponse,
                401: errorResponses[401],
                404: errorResponses[404],
            },
        },
        put: {
            tags: KAJI_TAG,
            summary: 'Update kaji ulang risiko',
            security: KAJI_SECURITY,
            parameters: [idParam],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateKajiUlangRisikoRequest' },
                    },
                },
            },
            responses: {
                200: singleResponse,
                400: errorResponses[400],
                401: errorResponses[401],
                404: errorResponses[404],
            },
        },
        delete: {
            tags: KAJI_TAG,
            summary: 'Hapus kaji ulang risiko (soft delete)',
            description: 'Melakukan soft delete — data tidak dihapus permanen, hanya ditandai `deletedAt`.',
            security: KAJI_SECURITY,
            parameters: [idParam],
            responses: {
                200: {
                    description: 'Data berhasil dihapus',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
                },
                401: errorResponses[401],
                404: errorResponses[404],
            },
        },
    },
};
