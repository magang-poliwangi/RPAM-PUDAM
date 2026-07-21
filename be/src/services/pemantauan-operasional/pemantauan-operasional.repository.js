// pemantauanOperasional.repository.js
import { prisma } from "../../databases/client.js";



export const includeRelasiPemantauanOperasional = {
    kajiUlangRisiko: {
        include: {
            rencanaPerbaikan: true,
            penilaianRisiko: {
                include: {
                    identifikasiDanKejadianBahaya: {
                        include: {
                            lokasiSpam: true,
                            bahayaKontaminasi: true,
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
            include: includeRelasiPemantauanOperasional,
        });
    }

    async findAll({ where, skip, take, orderBy }) {
        return prisma.pemantauanOperasional.findMany({
            where,
            skip,
            take,
            orderBy,
            include: includeRelasiPemantauanOperasional,
        });
    }

    async count({ where }) {
        return prisma.pemantauanOperasional.count({ where });
    }

    async findById({ id }) {
        return prisma.pemantauanOperasional.findFirst({
            where: { id, deletedAt: null },
            include: includeRelasiPemantauanOperasional,
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
            include: includeRelasiPemantauanOperasional,
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