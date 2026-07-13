import bcrypt from 'bcrypt'
import { ForbiddenError, InvariantError, NotFoundError } from "../../exceptions/error.js";

export default class UserService {
    constructor({ userRepository }) {
        this.userRepository = userRepository
    }

    async getUserById({ id }) {
        const user = await this.userRepository.findUserById({ id });

        if (!user) throw new NotFoundError("User tidak ditemukan.");
        return user;
    }

    async createUser({ username, password }) {
        const user = await this.userRepository.findByUsername(username);
        if (user) throw new InvariantError("Username sudah digunakan.");
        const passwordHash = await bcrypt.hash(password, 10)
        const result = await this.userRepository.createUser({ username, password: passwordHash, role: "USER" });
        return result;
    }

    async deleteUser({ id }) {
        const user = await this.userRepository.findUserById({ id });
        if (!user) throw new NotFoundError("User tidak ditemukan.");

        if (user.role === "ADMIN") throw new ForbiddenError("Admin tidak dapat dihapus.");
        await this.userRepository.deleteUser({ id });
    }

    async changeActiveUser({ id, isActive }) {
        const user = await this.userRepository.findUserById({ id });
        if (!user) throw new NotFoundError("User tidak ditemukan.");
        const result = await this.userRepository.changeActive({ id, isActive });
        return result;
    }

    async updateUser({ id, username, password }) {
        const user = await this.userRepository.findUserById({ id });

        if (!user) {
            throw new NotFoundError("User tidak ditemukan.");
        }

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

        return this.userRepository.updateUser({
            id,
            username: data.username,
            password: data.password,
        });
    }

    async getAllUser({ id = undefined }) {
        const data = await this.userRepository.getAllUser({ excludeId: id });
        return data;
    }

}
