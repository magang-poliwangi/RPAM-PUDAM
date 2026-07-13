export const userPaths = {
    '/api/user': {
        post: {
            tags: ['User'],
            summary: 'Buat user baru',
            description: 'Membuat user baru. Hanya dapat dilakukan oleh ADMIN.',
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateUserRequest' },
                    },
                },
            },
            responses: {
                201: {
                    description: 'User berhasil dibuat',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/ApiResponse' },
                                    {
                                        type: 'object',
                                        properties: { data: { $ref: '#/components/schemas/User' } },
                                    },
                                ],
                            },
                        },
                    },
                },
                400: { description: 'Validasi gagal', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                403: { description: 'Bukan ADMIN', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                409: { description: 'Username sudah digunakan', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            },
        },
        get: {
            tags: ['User'],
            summary: 'Dapatkan semua user',
            description: 'Mengembalikan daftar semua user kecuali diri sendiri. Hanya ADMIN.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Daftar user berhasil diambil',
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
                                                    users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
                401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                403: { description: 'Bukan ADMIN', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            },
        },
    },
    '/api/user/me': {
        get: {
            tags: ['User'],
            summary: 'Dapatkan data diri sendiri',
            description: 'Mengembalikan data user yang sedang login.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Data user berhasil diambil',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/ApiResponse' },
                                    {
                                        type: 'object',
                                        properties: { data: { $ref: '#/components/schemas/User' } },
                                    },
                                ],
                            },
                        },
                    },
                },
                401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            },
        },
    },
    '/api/user/{id}': {
        put: {
            tags: ['User'],
            summary: 'Update user',
            description: 'Memperbarui data user berdasarkan ID. Hanya ADMIN.',
            security: [{ BearerAuth: [] }],
            parameters: [
                { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID User' },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateUserRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'User berhasil diupdate',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
                },
                400: { description: 'Validasi gagal', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                403: { description: 'Bukan ADMIN', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                404: { description: 'User tidak ditemukan', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            },
        },
        delete: {
            tags: ['User'],
            summary: 'Hapus user',
            description: 'Menghapus user berdasarkan ID. Tidak bisa menghapus ADMIN.',
            security: [{ BearerAuth: [] }],
            parameters: [
                { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID User' },
            ],
            responses: {
                200: {
                    description: 'User berhasil dihapus',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
                },
                401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                403: { description: 'Bukan ADMIN atau mencoba hapus Admin', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                404: { description: 'User tidak ditemukan', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            },
        },
    },
    '/api/user/active/{id}': {
        patch: {
            tags: ['User'],
            summary: 'Aktifkan user',
            description: 'Mengaktifkan akun user berdasarkan ID. Hanya ADMIN.',
            security: [{ BearerAuth: [] }],
            parameters: [
                { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID User' },
            ],
            responses: {
                200: {
                    description: 'User berhasil diaktifkan',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
                },
                401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                403: { description: 'Bukan ADMIN', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                404: { description: 'User tidak ditemukan', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            },
        },
    },
    '/api/user/deactive/{id}': {
        patch: {
            tags: ['User'],
            summary: 'Nonaktifkan user',
            description: 'Menonaktifkan akun user berdasarkan ID. Hanya ADMIN.',
            security: [{ BearerAuth: [] }],
            parameters: [
                { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'ID User' },
            ],
            responses: {
                200: {
                    description: 'User berhasil dinonaktifkan',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
                },
                401: { description: 'Tidak terautentikasi', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                403: { description: 'Bukan ADMIN', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                404: { description: 'User tidak ditemukan', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            },
        },
    },
};
