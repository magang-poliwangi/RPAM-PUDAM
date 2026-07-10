import bcrypt from 'bcrypt';
import { AuthenticationError, NotFoundError } from '../../exceptions/error.js';
import TokenManager from '../../security/token-manager.js';
export default class AuthService {
    constructor(
        { authRepository, userRepository }
    ) {
        this.authRepository = authRepository
        this.userRepository = userRepository
    }
    //FR-01
    async login({ username, password }) {
        const user = await this.userRepository.findByUsername(username)
        const valid = user && await bcrypt.compare(password, user.password);

        if (!valid) throw new AuthenticationError("Kredensial yang Anda berikan salah");


        const accessToken = TokenManager.generateAccessToken({ id: user.id });
        const refreshToken = TokenManager.generateRefreshToken({ id: user.id });

        await this.authRepository.createRefreshToken({ userId: user.id, token: refreshToken });

        return { accessToken, refreshToken }
    }

    //FR-05
    async logout({ token }) {
        await this.authRepository.deleteRefreshToken({ token });
    }

    async newAccessToken({ token }) {
        const result = await this.authRepository.findRefreshToken({ token })
        if (!result) throw new NotFoundError("Token invalid")
        const { id } = TokenManager.verifyRefreshToken(result.token);

        const accessToken = TokenManager.generateAccessToken({ id });
        return { accessToken }
    }
}