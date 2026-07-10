import { nanoid } from "nanoid";
import { prisma } from "../../databases/client.js";

export default class UserRepository {
    async getAllUser({ excludeId } = {}) {
        return prisma.user.findMany({
            where: excludeId ? { id: { not: excludeId } } : undefined,
            select: {
                id: true,
                isActive: true,
                createdAt: true,
                role: true,
                updatedAt: true,
                username: true
            }
        });
    }

    async findUserById({ id }) {
        return prisma.user.findUnique({
            where: { id },
            select: { id: true, username: true, role: true, isActive: true, createdAt: true, updatedAt: true }
        })
    }

    async findByUsername(username) {
        return prisma.user.findUnique({
            where: { username },
        })
    }

    async createUser({ username, password, role }) {
        return prisma.user.create({
            data: {
                id: `user-${nanoid()}`,
                username,
                password,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                role: role
            },
            select: {
                id: true,
                username: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                role: true

            }
        })
    }

    async deleteUser({ id }) {
        return prisma.user.delete({
            where: { id }
        })
    }

    async changeActive({ id, isActive }) {
        return prisma.user.update({
            where: { id },
            select: { id: true, createdAt: true, isActive: true, role: true, updatedAt: true, username: true },
            data: { isActive: isActive, updatedAt: new Date() }
        })
    }

    async updateUser({ id, username, password }) {
        return prisma.user.update({
            where: { id },
            data: {
                username,
                password
            }
        })
    }


}