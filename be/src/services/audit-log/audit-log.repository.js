import { prisma } from '../../databases/client.js';
const includeRelasi = {
    user: { select: { id: true, username: true } },
};
export default class AuditLogRepository {
    async create({ data }) {
        return prisma.auditLog.create({ data });
    }
    async findAll({ where, skip, take, orderBy }) {
        return prisma.auditLog.findMany({
            where,
            skip,
            take,
            orderBy,
            include: includeRelasi,
        });
    }

    async count({ where }) {
        return prisma.auditLog.count({ where });
    }
}