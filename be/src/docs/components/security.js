export const securitySchemes = {
    BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan Access Token JWT. Diperoleh dari endpoint POST /api/auth.',
    },
};
