import { prisma } from '../../databases/client.js';

export default class KajiUlangRisikoRepository {
    async findByPenilaianRisikoId({ penilaianRisikoId }) {
        return prisma.kajiUlangRisiko.findUnique({
            where: { penilaianRisikoId },
        });
    }

    async create({ data }) {
        return prisma.kajiUlangRisiko.create({ data });
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.kajiUlangRisiko.findMany({
            where,
            skip,
            take,
            orderBy,
            include: { penilaianRisiko: { include: { identifikasiDanKejadianBahaya: { include: { lokasiSpam: true } } } } },
        });
    }

    async count({ where }) {
        return prisma.kajiUlangRisiko.count({ where });
    }

    async findById({ id }) {
        return prisma.kajiUlangRisiko.findFirst({
            where: { id, deletedAt: null },
            include: { penilaianRisiko: { include: { identifikasiDanKejadianBahaya: true } } },
        });
    }

    async update({ id, data }) {
        return prisma.kajiUlangRisiko.update({ where: { id }, data });
    }

    async softDelete({ id }) {
        return prisma.kajiUlangRisiko.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
