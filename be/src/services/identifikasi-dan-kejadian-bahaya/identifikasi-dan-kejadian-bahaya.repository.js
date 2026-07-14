import { prisma } from '../../databases/client.js';

export default class IdentifikasiDanKejadianBahayaRepository {
    async create({ data }) {
        return prisma.identifikasiDanKejadianBahaya.create({ data });
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.identifikasiDanKejadianBahaya.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
                lokasiSpam: true,
                penilaianRisiko: true,
            },
        });
    }

    async count({ where }) {
        return prisma.identifikasiDanKejadianBahaya.count({ where });
    }

    async findById({ id }) {
        return prisma.identifikasiDanKejadianBahaya.findFirst({
            where: { id, deletedAt: null },
            include: {
                lokasiSpam: true,
                penilaianRisiko: true,
            },
        });
    }

    async update({ id, data }) {
        return prisma.identifikasiDanKejadianBahaya.update({ where: { id }, data });
    }

    async softDelete({ id }) {
        return prisma.identifikasiDanKejadianBahaya.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}