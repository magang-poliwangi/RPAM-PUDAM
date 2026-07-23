import { prisma } from "../../databases/client.js";
export default class AuthRepository {

    async createRefreshToken({ userId, token }) {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        return prisma.authentikasi.upsert({
            where: { userId },
            update: {
                token,
                expiresAt,
            },
            create: {
                token,
                userId,
                expiresAt,
            },
        });
    }

    async deleteRefreshToken({ token }) {
        return prisma.authentikasi.delete({
            where: { token }
        })
    }
    async findRefreshToken({ token }) {
        return prisma.authentikasi.findUnique({
            where: { token }
        })
    }
}