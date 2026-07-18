// pemantauanOperasional.repository.js
import { prisma } from "../../databases/client.js";



const includeRelasi = {
    kajiUlangRisiko: {
        include: {
            rencanaPerbaikan: true,
            penilaianRisiko: {
                include: {
                    identifikasiDanKejadianBahaya: {
                        include: {
                            lokasiSpam: true,
                        },
                    },
                },
            },
        },
    },
};

export default class PemantauanOperasionalRepository {
    async create({ data }) {
        return prisma.pemantauanOperasional.create({
            data,
            include: includeRelasi,
        });
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.pemantauanOperasional.findMany({
            where,
            skip,
            take,
            orderBy,
            include: includeRelasi,
        });
    }

    async count({ where }) {
        return prisma.pemantauanOperasional.count({ where });
    }

    async findById({ id }) {
        return prisma.pemantauanOperasional.findFirst({
            where: { id, deletedAt: null },
            include: includeRelasi,
        });
    }

    async findByKajiUlangRisikoId({ kajiUlangRisikoId, excludeId = null }) {
        return prisma.pemantauanOperasional.findFirst({
            where: {
                kajiUlangRisikoId,
                deletedAt: null,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
    }

    async update({ id, data }) {
        return prisma.pemantauanOperasional.update({
            where: { id },
            data,
            include: includeRelasi,
        });
    }

    async softDelete({ id }) {
        return prisma.pemantauanOperasional.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async findDropdownKajiUlangRisiko() {
        return prisma.kajiUlangRisiko.findMany({
            where: { deletedAt: null, pemantauanOperasional: null },
            select: {
                id: true,
                tindakanPengendalian: true,
                validasi: true,
                penilaianRisiko: {
                    select: {
                        identifikasiDanKejadianBahaya: {
                            select: {
                                kodeRisiko: true,
                                kejadianBahayaXYZ: true,
                                lokasiSpam: { select: { kodeLokasi: true } },
                            },
                        },
                    },
                },
            },
        });
    }
}