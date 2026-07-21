import { prisma } from '../../databases/client.js';
import { includeRelasiKajiUlangRisiko } from '../kaji-ulang-risiko/kaji-ulang-risiko.repository.js'
import { includeRelasiIdentifikasiDanKejadianBahaya } from '../identifikasi-dan-kejadian-bahaya/identifikasi-dan-kejadian-bahaya.repository.js'
import { includeRelasiPenilaianRisiko } from '../penilaian-risiko/penilaian-risiko.repository.js'
import { includeRelasiRencanPerbaikan } from '../rencana-perbaikan/rencana-perbaikan.repository.js';
import { includeRelasiPemantauanOperasional } from '../pemantauan-operasional/pemantauan-operasional.repository.js';
export default class ExcelRepository {


    async findAllLokasiSpam() {
        return prisma.lokasiSpam.findMany({ where: { deletedAt: null } });
    }

    async findAllBahayaKontaminasi() {
        return prisma.bahayaKontaminasi.findMany({ where: { deletedAt: null } });
    }

    async findAllIdentifikasiBahaya() {
        return prisma.identifikasiDanKejadianBahaya.findMany({
            where: { deletedAt: null },
            include:  includeRelasiIdentifikasiDanKejadianBahaya ,
        });
    }

    async findAllPenilaianRisiko() {
        return prisma.penilaianRisiko.findMany({
            where: { deletedAt: null },
            include: includeRelasiPenilaianRisiko,
        });
    }

    async findAllKajiUlangRisiko() {
        return prisma.kajiUlangRisiko.findMany({
            where: { deletedAt: null },
            include:  includeRelasiKajiUlangRisiko,
        });
    }

    async findAllRencanaPerbaikan() {
        return prisma.rencanaPerbaikan.findMany({
            where: { deletedAt: null },
            include:includeRelasiRencanPerbaikan,
        });
    }

    async findAllPemantauanOperasional() {
        return prisma.pemantauanOperasional.findMany({
            where: { deletedAt: null },
            include: includeRelasiPemantauanOperasional,
        });
    }



    async findLokasiByKode(kodeLokasi) {
        return prisma.lokasiSpam.findUnique({ where: { kodeLokasi } });
    }

    async findBahayaByKode(kodeRisiko) {
        return prisma.bahayaKontaminasi.findUnique({ where: { kodeRisiko } });
    }

    async findIdentifikasiByKode(kodeRisiko) {
        return prisma.identifikasiDanKejadianBahaya.findFirst({ where: { kodeRisiko } });
    }

    async findIdentifikasiWithPenilaianByKode(kodeRisiko) {
        return prisma.identifikasiDanKejadianBahaya.findFirst({
            where: { kodeRisiko },
            include: { penilaianRisiko: true },
        });
    }

    async findKajiUlangByKodeRisiko(kodeRisiko) {
        return prisma.kajiUlangRisiko.findFirst({
            where: { penilaianRisiko: { identifikasiDanKejadianBahaya: { kodeRisiko } } },
        });
    }



    async upsertLokasiSpam({ kodeLokasi, data, idPrefix }) {
        return prisma.lokasiSpam.upsert({
            where: { kodeLokasi },
            update: data,
            create: { id: idPrefix, kodeLokasi, ...data },
        });
    }

    async upsertBahayaKontaminasi({ kodeRisiko, data }) {
        return prisma.bahayaKontaminasi.upsert({
            where: { kodeRisiko },
            update: data,
            create: { kodeRisiko, ...data },
        });
    }

    async upsertIdentifikasiBahaya({ kodeRisiko, data, idPrefix }) {
        return prisma.identifikasiDanKejadianBahaya.upsert({
            where: { kodeRisiko },
            update: data,
            create: { id: idPrefix, kodeRisiko, ...data },
        });
    }

    async upsertPenilaianRisiko({ identifikasiDanKejadianBahayaId, data }) {
        return prisma.penilaianRisiko.upsert({
            where: { identifikasiDanKejadianBahayaId },
            update: data,
            create: { identifikasiDanKejadianBahayaId, ...data },
        });
    }

    async upsertKajiUlangRisiko({ penilaianRisikoId, data }) {
        return prisma.kajiUlangRisiko.upsert({
            where: { penilaianRisikoId },
            update: data,
            create: { penilaianRisikoId, ...data },
        });
    }

    async upsertRencanaPerbaikan({ kajiUlangRisikoId, data }) {
        return prisma.rencanaPerbaikan.upsert({
            where: { kajiUlangRisikoId },
            update: data,
            create: { kajiUlangRisikoId, ...data },
        });
    }

    async upsertPemantauanOperasional({ kajiUlangRisikoId, data }) {
        return prisma.pemantauanOperasional.upsert({
            where: { kajiUlangRisikoId },
            update: data,
            create: { kajiUlangRisikoId, ...data },
        });
    }
}