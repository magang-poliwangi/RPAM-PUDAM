import { prisma } from "../../databases/client.js";

export default class LokasiSpamRepository {
    async create({ data }) {
        return prisma.lokasiSpam.create({ data });
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.lokasiSpam.findMany({
            where,
            skip,
            take,
            orderBy,
        });
    }

    async getFilterOptions() {
        return prisma.lokasiSpam.findMany({
            where: {
                deletedAt: null,
            },
            select: {
                kodeLokasi: true,
                simbol: true,
            },
            orderBy: {
                kodeLokasi: "asc",
            },
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

    // async cascadeSoftDelete({ id }) {
    //     const now = new Date();
    //     return prisma.$transaction(async (tx) => {
    //         // 1. Ambil semua identifikasi milik lokasi ini
    //         const identifikasiList = await tx.identifikasiDanKejadianBahaya.findMany({
    //             where: { lokasiSpamId: id },
    //             select: { id: true },
    //         });
    //         const identifikasiIds = identifikasiList.map((i) => i.id);

    //         if (identifikasiIds.length > 0) {
    //             // 2. Ambil semua penilaian risiko terkait
    //             const penilaianList = await tx.penilaianRisiko.findMany({
    //                 where: { identifikasiDanKejadianBahayaId: { in: identifikasiIds } },
    //                 select: { id: true },
    //             });
    //             const penilaianIds = penilaianList.map((p) => p.id);

    //             if (penilaianIds.length > 0) {
    //                 // 3. Ambil semua kaji ulang risiko terkait
    //                 const kajiList = await tx.kajiUlangRisiko.findMany({
    //                     where: { penilaianRisikoId: { in: penilaianIds } },
    //                     select: { id: true },
    //                 });
    //                 const kajiIds = kajiList.map((k) => k.id);

    //                 if (kajiIds.length > 0) {
    //                     // 4. Soft-delete leaf nodes
    //                     await tx.rencanaPerbaikan.updateMany({
    //                         where: { kajiUlangRisikoId: { in: kajiIds }, deletedAt: null },
    //                         data: { deletedAt: now },
    //                     });
    //                     await tx.pemantauanOperasional.updateMany({
    //                         where: { kajiUlangRisikoId: { in: kajiIds }, deletedAt: null },
    //                         data: { deletedAt: now },
    //                     });
    //                     await tx.kajiUlangRisiko.updateMany({
    //                         where: { id: { in: kajiIds } },
    //                         data: { deletedAt: now },
    //                     });
    //                 }

    //                 await tx.penilaianRisiko.updateMany({
    //                     where: { id: { in: penilaianIds } },
    //                     data: { deletedAt: now },
    //                 });
    //             }

    //             await tx.identifikasiDanKejadianBahaya.updateMany({
    //                 where: { id: { in: identifikasiIds } },
    //                 data: { deletedAt: now },
    //             });
    //         }

    //         // 5. Soft-delete lokasi spam (parent)
    //         return tx.lokasiSpam.update({
    //             where: { id },
    //             data: { deletedAt: now },
    //         });
    //     });
    // }
    async cascadeSoftDelete({ id }) {
        return prisma.lokasiSpam.delete({
            where: { id }
        })
    }
}