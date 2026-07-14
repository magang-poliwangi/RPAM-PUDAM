import { prisma } from "../../databases/client.js";

export default class LokasiSpamRepository {
    async create({ data }) {
        return prisma.lokasiSpam.create({ data })
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.lokasiSpam.findMany({
            where,
            skip,
            take,
            orderBy,
        });
    }

    async findById({ id }) {
        return prisma.lokasiSpam.findFirst({
            where: { id, deletedAt: null },
        });
    }

    async update({ id, data }) {
        return prisma.lokasiSpam.update({
            where: { id },
            data,
        });
    }
      async count({ where }) {
        return prisma.lokasiSpam.count({ where });
    }

    async softDelete({ id }) {
        return prisma.lokasiSpam.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}