export const schemas = {
    // ─── Generic ────────────────────────────────────────────────────────────────
    ApiResponse: {
        type: 'object',
        properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Operasi berhasil' },
            data: { type: 'object', nullable: true },
        },
    },
    Pagination: {
        type: 'object',
        properties: {
            total: { type: 'integer', example: 100 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 10 },
        },
    },
    ErrorResponse: {
        type: 'object',
        properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Pesan error' },
        },
    },

    // ─── Auth ────────────────────────────────────────────────────────────────────
    LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
            username: { type: 'string', example: 'admin' },
            password: { type: 'string', format: 'password', example: 'password123' },
        },
    },
    LoginResponse: {
        type: 'object',
        properties: {
            accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
    },

    // ─── User ────────────────────────────────────────────────────────────────────
    User: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'user-abc123' },
            username: { type: 'string', example: 'john_doe' },
            role: { type: 'string', enum: ['ADMIN', 'USER'], example: 'USER' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateUserRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
            username: {
                type: 'string', minLength: 4, maxLength: 15,
                pattern: '^[a-zA-Z0-9_-]+$', example: 'john_doe',
            },
            password: { type: 'string', minLength: 8, format: 'password', example: 'secret123' },
        },
    },
    UpdateUserRequest: {
        type: 'object',
        properties: {
            username: {
                type: 'string', minLength: 4, maxLength: 15,
                pattern: '^[a-zA-Z0-9_-]+$', example: 'john_updated', nullable: true,
            },
            password: { type: 'string', minLength: 8, format: 'password', example: 'newpass123', nullable: true },
        },
    },

    // ─── Kaji Ulang Risiko ───────────────────────────────────────────────────────
    KajiUlangRisiko: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'kur-abc123' },
            penilaianRisikoId: { type: 'string', example: 'pr-xyz789' },
            tindakanPengendalian: { type: 'string', example: 'Pasang pagar pengaman' },
            referensi: { type: 'string', nullable: true, example: 'SNI 6775:2008' },
            validasi: {
                type: 'string',
                enum: ['EFEKTIF', 'TIDAK_EFEKTIF', 'TIDAK_PASTI'],
                example: 'EFEKTIF',
            },
            peluangKejadianBahaya: { type: 'integer', minimum: 1, maximum: 5, example: 2 },
            dampakKeparahan: { type: 'integer', minimum: 1, maximum: 5, example: 3 },
            skorRisiko: { type: 'integer', example: 6 },
            skorSetelah: { type: 'integer', example: 6 },
            peluangSetelah: { type: 'integer', example: 2 },
            dampakSetelah: { type: 'integer', example: 3 },
            tingkatRisikoSetelah: { type: 'string', example: 'SEDANG' },
            deletedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateKajiUlangRisikoRequest: {
        type: 'object',
        required: ['penilaianRisikoId', 'tindakanPengendalian', 'validasi', 'peluangSetelah', 'dampakSetelah'],
        properties: {
            penilaianRisikoId: { type: 'string', example: 'pr-xyz789' },
            tindakanPengendalian: { type: 'string', example: 'Pasang pagar pengaman' },
            referensi: { type: 'string', nullable: true, example: 'SNI 6775:2008' },
            validasi: {
                type: 'string',
                enum: ['EFEKTIF', 'TIDAK_EFEKTIF', 'TIDAK_PASTI'],
                example: 'EFEKTIF',
            },
            peluangSetelah: { type: 'integer', minimum: 1, maximum: 5, example: 2 },
            dampakSetelah: { type: 'integer', minimum: 1, maximum: 5, example: 3 },
        },
    },
    UpdateKajiUlangRisikoRequest: {
        type: 'object',
        properties: {
            penilaianRisikoId: { type: 'string', example: 'pr-xyz789' },
            tindakanPengendalian: { type: 'string', example: 'Pasang pagar pengaman' },
            referensi: { type: 'string', nullable: true },
            validasi: { type: 'string', enum: ['EFEKTIF', 'TIDAK_EFEKTIF', 'TIDAK_PASTI'] },
            peluangSetelah: { type: 'integer', minimum: 1, maximum: 5 },
            dampakSetelah: { type: 'integer', minimum: 1, maximum: 5 },
        },
    },

    // ─── Rencana Perbaikan ───────────────────────────────────────────────────────
    RencanaPerbaikan: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'rp-abc123' },
            kajiUlangRisikoId: { type: 'string', example: 'kur-abc123' },
            rencanaPerbaikan: { type: 'string', example: 'Perbaikan jalur pipa distribusi' },
            penanggungJawab: { type: 'string', example: 'Divisi Teknis' },
            jadwal: { type: 'string', example: '2024-06-01' },
            biaya: { type: 'number', nullable: true, example: 5000000 },
            sumberPembiayaan: { type: 'string', nullable: true, example: 'APBD' },
            statusKemajuan: {
                type: 'string',
                enum: ['BELUM_MULAI', 'SEDANG_BERJALAN', 'SELESAI', 'TERTUNDA'],
                example: 'BELUM_MULAI',
            },
            kendala: { type: 'string', nullable: true, example: 'Keterbatasan anggaran' },
            prioritas: {
                type: 'string',
                enum: ['PENDEK', 'MENENGAH', 'PANJANG'],
                example: 'PENDEK',
            },
            deletedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateRencanaPerbaikanRequest: {
        type: 'object',
        required: ['kajiUlangRisikoId', 'rencanaPerbaikan', 'penanggungJawab', 'jadwal', 'statusKemajuan', 'prioritas'],
        properties: {
            kajiUlangRisikoId: { type: 'string', example: 'kur-abc123' },
            rencanaPerbaikan: { type: 'string', example: 'Perbaikan jalur pipa distribusi' },
            penanggungJawab: { type: 'string', example: 'Divisi Teknis' },
            jadwal: { type: 'string', example: '2024-06-01' },
            biaya: { type: 'number', nullable: true, example: 5000000 },
            sumberPembiayaan: { type: 'string', nullable: true, example: 'APBD' },
            statusKemajuan: {
                type: 'string',
                enum: ['BELUM_MULAI', 'SEDANG_BERJALAN', 'SELESAI', 'TERTUNDA'],
                example: 'BELUM_MULAI',
            },
            kendala: { type: 'string', nullable: true, example: 'Keterbatasan anggaran' },
            prioritas: {
                type: 'string',
                enum: ['PENDEK', 'MENENGAH', 'PANJANG'],
                example: 'PENDEK',
            },
        },
    },
    UpdateRencanaPerbaikanRequest: {
        type: 'object',
        properties: {
            kajiUlangRisikoId: { type: 'string' },
            rencanaPerbaikan: { type: 'string' },
            penanggungJawab: { type: 'string' },
            jadwal: { type: 'string' },
            biaya: { type: 'number', nullable: true },
            sumberPembiayaan: { type: 'string', nullable: true },
            statusKemajuan: { type: 'string', enum: ['BELUM_MULAI', 'SEDANG_BERJALAN', 'SELESAI', 'TERTUNDA'] },
            kendala: { type: 'string', nullable: true },
            prioritas: { type: 'string', enum: ['PENDEK', 'MENENGAH', 'PANJANG'] },
        },
    },
};
