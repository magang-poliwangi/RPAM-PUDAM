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

    // async cascadeSoftDelete({ id }) {
    //     const now = new Date();
    //     return prisma.$transaction(async (tx) => {
    //         const identifikasiList = await tx.identifikasiDanKejadianBahaya.findMany({
    //             where: { bahayaKontaminasiId: id },
    //             select: { id: true },
    //         });
    //         const identifikasiIds = identifikasiList.map((i) => i.id);

    //         if (identifikasiIds.length > 0) {
    //             const penilaianList = await tx.penilaianRisiko.findMany({
    //                 where: { identifikasiDanKejadianBahayaId: { in: identifikasiIds } },
    //                 select: { id: true },
    //             });
    //             const penilaianIds = penilaianList.map((p) => p.id);

    //             if (penilaianIds.length > 0) {
    //                 const kajiList = await tx.kajiUlangRisiko.findMany({
    //                     where: { penilaianRisikoId: { in: penilaianIds } },
    //                     select: { id: true },
    //                 });
    //                 const kajiIds = kajiList.map((k) => k.id);

    //                 if (kajiIds.length > 0) {
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

    //         return tx.bahayaKontaminasi.update({
    //             where: { id },
    //             data: { deletedAt: now },
    //         });
    //     });
    // }
    async cascadeSoftDelete({ id }) {

        return prisma.bahayaKontaminasi.delete({
            where: { id }
        })
    }
}