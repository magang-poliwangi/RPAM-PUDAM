import bcrypt from 'bcrypt';
import { AuthenticationError, NotFoundError } from '../../exceptions/error.js';
import TokenManager from '../../security/token-manager.js';
import { catatAuditLog } from '../../utils/audit-log.helper.js';

export default class AuthService {
    constructor(
        { authRepository, userRepository, auditLogRepository }
    ) {
        this.authRepository = authRepository
        this.userRepository = userRepository
        this.auditLogRepository = auditLogRepository;

    }
    //FR-01
    async login({ username, password }) {
        const user = await this.userRepository.findByUsername(username)
        const valid = user && await bcrypt.compare(password, user.password);

        if (!valid) throw new AuthenticationError("Kredensial yang Anda berikan salah");


        const accessToken = TokenManager.generateAccessToken({ id: user.id });
        const refreshToken = TokenManager.generateRefreshToken({ id: user.id });
    
        await this.authRepository.createRefreshToken({ userId: user.id, token: refreshToken });

        await catatAuditLog(this.auditLogRepository,{
            userId: user.id,
            aksi: 'LOGIN',
            namaTabel: 'users',
            recordId: null,
            keterangan: `User login `,
        });

        return { accessToken, refreshToken }
    }

    //FR-05
    async logout({ token, userId }) {
        await this.authRepository.deleteRefreshToken({ token });
        await catatAuditLog(this.auditLogRepository,{
            userId,
            aksi: 'LOGOUT',
            namaTabel: 'users',
            recordId: null,
            keterangan: `User logout `,
        });
    }

    async newAccessToken({ token }) {
        const result = await this.authRepository.findRefreshToken({ token })
        if (!result) throw new NotFoundError("Token invalid")
        const { id } = TokenManager.verifyRefreshToken(result.token);

        const accessToken = TokenManager.generateAccessToken({ id });
        return { accessToken }
    }
}