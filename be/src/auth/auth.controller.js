import bcrypt from 'bcrypt';
import { prisma } from '../databases/client.js';
import TokenManager from '../security/token-manager.js';
import { AuthenticationError, NotFoundError } from '../exceptions/error.js';
import response from '../utils/response.js';
import { logAudit } from '../utils/audit-logger.js';

class AuthController {
  static async login(req, res, next) {
    try {
      const { username, password } = req.validated;

      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        throw new NotFoundError('Username tidak ditemukan');
      }

      if (!user.isActive) {
        throw new AuthenticationError('Akun tidak aktif');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new AuthenticationError('Kredensial tidak valid');
      }

      const payload = {
        id: user.id,
        username: user.username,
        role: user.role
      };

      const accessToken = TokenManager.generateAccessToken(payload);

      await logAudit(user.id, 'LOGIN', 'users', user.id, null, null);

      return response(res, 200, 'Login berhasil', { accessToken, role: user.role });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      // In a stateless JWT setup, logout is mainly handled client-side by destroying the token.
      // We just log the audit action here.
      if (req.user) {
        await logAudit(req.user.id, 'LOGOUT', 'users', req.user.id, null, null);
      }
      return response(res, 200, 'Logout berhasil', null);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
