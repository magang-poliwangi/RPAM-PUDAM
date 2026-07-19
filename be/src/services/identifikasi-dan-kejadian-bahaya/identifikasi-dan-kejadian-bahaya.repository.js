import { prisma } from '../../databases/client.js';
import { parseKodeNumber, parseKodeRisikoNumber } from '../../utils/generate-kode.js';

const includeRelasi = {
    lokasiSpam: true,
    bahayaKontaminasi: true,
    penilaianRisiko: {
        include: {
            kajiUlangRisiko: {
                include: {
                    rencanaPerbaikan: true,
                    pemantauanOperasional: true,
                },
            }
        },
    },

}
export default class IdentifikasiDanKejadianBahayaRepository {
    async create({ data }) {
        return prisma.identifikasiDanKejadianBahaya.create({
            data,
            include: includeRelasi,
        });
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.identifikasiDanKejadianBahaya.findMany({
            where,
            skip,
            take,
            orderBy,
            include: includeRelasi,
        });
    }

    async count({ where }) {
        return prisma.identifikasiDanKejadianBahaya.count({ where });
    }

    async findById({ id }) {
        return prisma.identifikasiDanKejadianBahaya.findFirst({
            where: { id, deletedAt: null },
            include: includeRelasi,
        });
    }

    async update({ id, data }) {
        return prisma.identifikasiDanKejadianBahaya.update({
            where: { id },
            data,
            include: {
                lokasiSpam: true,
                penilaianRisiko: true,
            },
        });
    }

    async cascadeSoftDelete({ id }) {
        const now = new Date();

        return prisma.$transaction(async (tx) => {

            const penilaian = await tx.penilaianRisiko.findFirst({
                where: { identifikasiDanKejadianBahayaId: id },
                select: { id: true },
            });

            if (penilaian) {

                const kaji = await tx.kajiUlangRisiko.findFirst({
                    where: { penilaianRisikoId: penilaian.id },
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


                await tx.penilaianRisiko.update({
                    where: { id: penilaian.id },
                    data: { deletedAt: now },
                });
            }

            // 6. Soft-delete IdentifikasiDanKejadianBahaya (parent)
            return tx.identifikasiDanKejadianBahaya.update({
                where: { id },
                data: { deletedAt: now },
            });
        });
    }

    async findLokasiSpamById(lokasiSpamId) {
        return prisma.lokasiSpam.findFirst({
            where: { id: lokasiSpamId, deletedAt: null },
            select: { kodeLokasi: true },
        });
    }

    async findBahayaKontaminasiById(bahayaKontaminasiId) {
        return prisma.bahayaKontaminasi.findFirst({
            where: { id: bahayaKontaminasiId, deletedAt: null },
            select: { kodeRisiko: true },
        });
    }

    async getLastKodeRisikoNumber(prefix) {
        const existing = await prisma.identifikasiDanKejadianBahaya.findMany({
            where: { kodeRisiko: { startsWith: prefix } },
            select: { kodeRisiko: true },
        });
        return existing.reduce(
            (max, row) => Math.max(max, parseKodeRisikoNumber(row.kodeRisiko, prefix)),
            0
        );
    }
    async getLastKodeLokasiNumber(prefix) {
        const existing = await prisma.lokasiSpam.findMany({
            where: { kodeLokasi: { startsWith: prefix } },
            select: { kodeLokasi: true },
        });
        return existing.reduce(
            (max, row) => Math.max(max, parseKodeNumber(row.kodeLokasi, prefix)),
            0
        );
    }
}