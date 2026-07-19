import { prisma } from '../../databases/client.js';

const includeRelasi = {
    lokasiSpam: true,
    penilaianRisiko: {
        include: {
            kajiUlangRisiko: {
                include:{
                    rencanaPerbaikan:true,
                    pemantauanOperasional:true,
                },
            }
        },
    },

}
export default class IdentifikasiDanKejadianBahayaRepository {
    async create({ data }) {
        return prisma.identifikasiDanKejadianBahaya.create({
            data,
            include: {
                lokasiSpam: true,
                penilaianRisiko: true,
            },
        });
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.identifikasiDanKejadianBahaya.findMany({
            where,
            skip,
            take,
            orderBy,
            include:includeRelasi,
        });
    }

    async count({ where }) {
        return prisma.identifikasiDanKejadianBahaya.count({ where });
    }

    async findById({ id }) {
        return prisma.identifikasiDanKejadianBahaya.findFirst({
            where: { id, deletedAt: null },
            include:includeRelasi,
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

    async softDelete({ id }) {
        return prisma.identifikasiDanKejadianBahaya.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}