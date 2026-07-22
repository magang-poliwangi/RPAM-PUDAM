
import { prisma } from '../../databases/client.js';

const includeRelasi = {
    kajiUlangRisiko: {
        include: {
            rencanaPerbaikan: true,
            pemantauanOperasional: true
        }
    },
    identifikasiDanKejadianBahaya: {
        include: {
            lokasiSpam: true,
            bahayaKontaminasi: true,
        }
    },
};

export default class PenilaianRisikoRepository {
    async findByIdentifikasiDanKejadianBahayaId({ identifikasiDanKejadianBahayaId }) {
        return prisma.penilaianRisiko.findFirst({
            where: { identifikasiDanKejadianBahayaId, deletedAt: null },
        });
    }

    async create({ data }) {
        return prisma.penilaianRisiko.create({ data });
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.penilaianRisiko.findMany({
            where,
            skip,
            take,
            orderBy,
            include: includeRelasi,
        });
    }

    async count({ where }) {
        return prisma.penilaianRisiko.count({ where });
    }

    async findById({ id }) {
        return prisma.penilaianRisiko.findFirst({
            where: { id, deletedAt: null },
            include: includeRelasi,
        });
    }

    async update({ id, data }) {
        return prisma.penilaianRisiko.update({ where: { id }, data });
    }

    async cascadeSoftDelete({ id }) {
        const now = new Date();
        return prisma.$transaction(async (tx) => {
            const kaji = await tx.kajiUlangRisiko.findFirst({
                where: { penilaianRisikoId: id },
                select: { id: true },
            });
            if (kaji) {
                await tx.rencanaPerbaikan.updateMany({
                    where: { kajiUlangRisikoId: kaji.id, deletedAt: null },
                    data: { deletedAt: now },
                });
                await tx.pemantauanOperasional.updateMany({
                    where: { kajiUlangRisikoId: kaji.id, deletedAt: null },
                    data: { deletedAt: now },
                });
                await tx.kajiUlangRisiko.update({
                    where: { id: kaji.id },
                    data: { deletedAt: now },
                });
            }
            return tx.penilaianRisiko.update({
                where: { id },
                data: { deletedAt: now },
            });
        });
    }
}