import swaggerJsdoc from 'swagger-jsdoc';
import { schemas } from './components/schema.js';
import { securitySchemes } from './components/security.js';
import { authPaths } from './paths/auth.paths.js';
import { userPaths } from './paths/user.paths.js';
import { kajiUlangRisikoPaths } from './paths/kaji-ulang-risiko.paths.js';
import { rencanaPerbaikanPaths } from './paths/rencana-perbaikan.paths.js';

const definition = {
    openapi: '3.0.0',
    info: {
        title: 'RPAM PUDAM API',
        version: '1.0.0',
        description: `
## API Dokumentasi RPAM PUDAM

Sistem **Rencana Pengamanan Air Minum (RPAM)** — platform manajemen risiko untuk PUDAM.

### Autentikasi
Hampir semua endpoint memerlukan **Bearer Token** (JWT Access Token).  
Login terlebih dahulu melalui \`POST /api/auth\` untuk mendapatkan \`accessToken\`.

### Alur Penggunaan
1. **Login** → \`POST /api/auth\`
2. Gunakan \`accessToken\` sebagai \`Authorization: Bearer <token>\`
3. Refresh token otomatis tersimpan di **httpOnly cookie**
4. Gunakan \`PUT /api/auth\` untuk mendapatkan Access Token baru
        `.trim(),
        contact: {
            name: 'PUDAM Dev Team',
        },
    },
    servers: [
        {
            url: `http://${process.env.HOST}:${process.env.PORT}` || 'http://localhost:5000',
            description: 'Development Server',
        },
    ],
    components: {
        schemas,
        securitySchemes,
    },
    paths: {
        ...authPaths,
        ...userPaths,
        ...kajiUlangRisikoPaths,
        ...rencanaPerbaikanPaths,
    },
    tags: [
        { name: 'Auth', description: 'Autentikasi — Login, Logout, Refresh Token' },
        { name: 'User', description: 'Manajemen User (Admin only)' },
        { name: 'Kaji Ulang Risiko', description: 'Kaji ulang dan pengendalian risiko setelah penilaian' },
        { name: 'Rencana Perbaikan', description: 'Tabel rencana perbaikan berdasarkan kaji ulang risiko' },
    ],
};

const options = {
    definition,
    apis: [], // paths defined inline above — no JSDoc scanning needed
};

export const swaggerSpec = swaggerJsdoc(options);
