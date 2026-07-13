export const authPaths = {
    '/api/auth': {
        post: {
            tags: ['Auth'],
            summary: 'Login',
            description: 'Autentikasi pengguna menggunakan username dan password. Mengembalikan Access Token dan menyimpan Refresh Token di httpOnly cookie.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoginRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Login berhasil',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/ApiResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/LoginResponse' },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
                401: {
                    description: 'Kredensial salah',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
                429: {
                    description: 'Terlalu banyak percobaan login',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
            },
        },
        delete: {
            tags: ['Auth'],
            summary: 'Logout',
            description: 'Menghapus Refresh Token dari database dan membersihkan cookie.',
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: 'Logout berhasil',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ApiResponse' },
                        },
                    },
                },
                401: {
                    description: 'Tidak terautentikasi',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
            },
        },
        put: {
            tags: ['Auth'],
            summary: 'Refresh Access Token',
            description: 'Mendapatkan Access Token baru menggunakan Refresh Token yang tersimpan di cookie.',
            responses: {
                200: {
                    description: 'Access Token baru berhasil dibuat',
                    content: {
                        'application/json': {
                            schema: {
                                allOf: [
                                    { $ref: '#/components/schemas/ApiResponse' },
                                    {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/LoginResponse' },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
                404: {
                    description: 'Refresh Token tidak valid atau tidak ditemukan',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' },
                        },
                    },
                },
            },
        },
    },
};
