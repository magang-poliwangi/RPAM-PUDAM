import { prisma } from '../../databases/client.js';

export default class RencanaPerbaikanRepository {
    async findByKajiUlangRisikoId({ kajiUlangRisikoId }) {
        return prisma.rencanaPerbaikan.findUnique({
            where: { kajiUlangRisikoId },
        });
    }

    async create({ data }) {
        return prisma.rencanaPerbaikan.create({ data });
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.rencanaPerbaikan.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
                kajiUlangRisiko: {
                    include: {
                        penilaianRisiko: {
                            include: { identifikasiDanKejadianBahaya: true },
                        },
                    },
                },
            },
        });
    }

    async count({ where }) {
        return prisma.rencanaPerbaikan.count({ where });
    }

    async findById({ id }) {
        return prisma.rencanaPerbaikan.findFirst({
            where: { id, deletedAt: null },
            include: {
                kajiUlangRisiko: {
                    include: {
                        penilaianRisiko: {
                            include: { identifikasiDanKejadianBahaya: true },
                        },
                    },
                },
            },
        });
    }

    async update({ id, data }) {
        return prisma.rencanaPerbaikan.update({ where: { id }, data });
    }

    async softDelete({ id }) {
        return prisma.rencanaPerbaikan.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
