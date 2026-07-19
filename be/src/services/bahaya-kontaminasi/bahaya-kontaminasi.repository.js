import { prisma } from "../../databases/client.js";

export default class BahayaKontaminasiRepository {
    async create({ data }) {
        return prisma.bahayaKontaminasi.create({ data })
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.bahayaKontaminasi.findMany({
            where,
            skip,
            take,
            orderBy,
        });
    }

    async findById({ id }) {
        return prisma.bahayaKontaminasi.findFirst({
            where: { id, deletedAt: null },
        });
    }

    async update({ id, data }) {
        return prisma.bahayaKontaminasi.update({
            where: { id },
            data,
        });
    }
      async count({ where }) {
        return prisma.bahayaKontaminasi.count({ where });
    }

    async softDelete({ id }) {
        return prisma.bahayaKontaminasi.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}