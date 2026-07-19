import bcrypt from 'bcrypt'
import { ForbiddenError, InvariantError, NotFoundError } from "../../exceptions/error.js";
import { catatAuditLog } from '../../utils/audit-log.helper.js';
const NAMA_TABEL = 'users'
export default class UserService {
    constructor({ userRepository, auditLogRepository }) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    async getUserById({ id }) {
        const user = await this.userRepository.findUserById({ id });

        if (!user) throw new NotFoundError("User tidak ditemukan.");
        return user;
    }

    async createUser({ username, password, userId }) {
        const user = await this.userRepository.findByUsername(username);
        if (user) throw new InvariantError("Username sudah digunakan.");
        const passwordHash = await bcrypt.hash(password, 10)
        const result = await this.userRepository.createUser({ username, password: passwordHash, role: "USER" });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'CREATE',
            namaTabel: NAMA_TABEL,
            recordId: result.id,
            keterangan: `Membuat akun user`,
        });
        return result;
    }

    async deleteUser({ id, userId }) {
        const user = await this.getUserById({ id });

        if (user.role === "ADMIN") throw new ForbiddenError("Admin tidak dapat dihapus.");
        await this.userRepository.deleteUser({ id });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'DELETE',
            namaTabel: NAMA_TABEL,
            recordId: id,
            keterangan: `Menghapus akun user`,
        });

    }

    async changeActiveUser({ id, isActive, userId }) {
        await this.getUserById({ id });
        const result = await this.userRepository.changeActive({ id, isActive });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'UPDATE',
            namaTabel: NAMA_TABEL,
            recordId: result.id,
            keterangan: `${isActive ? 'Mengaktifkan user' : 'Menonaktifkan user'}`,
        });

        return result;
    }

    async updateUser({ id, username, password, userId }) {
        await this.getUserById({ id });

        if (username) {
            const existingUser = await this.userRepository.findByUsername(username);
            if (existingUser && existingUser.id !== id) {
                throw new InvariantError("Username sudah digunakan.");
            }
        }

        const data = {};

        if (username) {
            data.username = username;
        }

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }


        const result = await this.userRepository.updateUser({
            id,
            username: data.username,
            password: data.password,
        });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'UPDATE',
            namaTabel: NAMA_TABEL,
            recordId: result.id,
            keterangan: `Memperbarui user`,
        });

        return result;
    }

    async getAllUser({ id = undefined }) {
        const data = await this.userRepository.getAllUser({ excludeId: id });
        return data;
    }

}
