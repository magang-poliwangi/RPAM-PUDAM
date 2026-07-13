const RP_TAG = ['Rencana Perbaikan'];
const RP_SECURITY = [{ BearerAuth: [] }];

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
                                    items: { type: 'array', items: { $ref: '#/components/schemas/RencanaPerbaikan' } },
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
                        properties: { data: { $ref: '#/components/schemas/RencanaPerbaikan' } },
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
    409: { description: 'Rencana perbaikan untuk kaji ulang ini sudah ada', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
};

const idParam = { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID Rencana Perbaikan' };
const queryParams = [
    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Halaman' },
    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 }, description: 'Jumlah data per halaman' },
    { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Cari berdasarkan nama rencana perbaikan' },
    { in: 'query', name: 'sortBy', schema: { type: 'string', default: 'createdAt' }, description: 'Field untuk sorting' },
    { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }, description: 'Arah sorting' },
];

export const rencanaPerbaikanPaths = {
    '/api/rencana-perbaikan': {
        post: {
            tags: RP_TAG,
            summary: 'Buat rencana perbaikan',
            description: 'Membuat data rencana perbaikan baru. Setiap kaji ulang risiko hanya boleh memiliki satu rencana perbaikan.',
            security: RP_SECURITY,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateRencanaPerbaikanRequest' },
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
                                        properties: { data: { $ref: '#/components/schemas/RencanaPerbaikan' } },
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
            tags: RP_TAG,
            summary: 'Dapatkan semua rencana perbaikan',
            description: 'Mengembalikan daftar rencana perbaikan dengan pagination dan pencarian.',
            security: RP_SECURITY,
            parameters: queryParams,
            responses: {
                200: listResponse,
                401: errorResponses[401],
            },
        },
    },
    '/api/rencana-perbaikan/{id}': {
        get: {
            tags: RP_TAG,
            summary: 'Dapatkan rencana perbaikan berdasarkan ID',
            security: RP_SECURITY,
            parameters: [idParam],
            responses: {
                200: singleResponse,
                401: errorResponses[401],
                404: errorResponses[404],
            },
        },
        put: {
            tags: RP_TAG,
            summary: 'Update rencana perbaikan',
            security: RP_SECURITY,
            parameters: [idParam],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateRencanaPerbaikanRequest' },
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
            tags: RP_TAG,
            summary: 'Hapus rencana perbaikan (soft delete)',
            description: 'Melakukan soft delete — data tidak dihapus permanen, hanya ditandai `deletedAt`.',
            security: RP_SECURITY,
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
