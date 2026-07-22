/* eslint-disable no-unused-vars */
import { nanoid } from 'nanoid';
import { ConflictError, NotFoundError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { hitungSkorRisiko, hitungTingkatRisiko } from '../../utils/score-calculator.js';
import { catatAuditLog } from '../../utils/audit-log.helper.js';
const NAMA_TABEL = 'kaji_ulang_risiko';
export default class KajiUlangRisikoService {
    constructor({ kajiUlangRisikoRepository, auditLogRepository }) {
        this.kajiUlangRisikoRepository = kajiUlangRisikoRepository;
        this.auditLogRepository = auditLogRepository;
    }

    async create({ data, userId }) {
        const existing = await this.kajiUlangRisikoRepository.findByPenilaianRisikoId({
            penilaianRisikoId: data.penilaianRisikoId,
        });
        if (existing) {
            if (!existing.deletedAt) {
                throw new ConflictError('Kaji Ulang Risiko untuk Penilaian ini sudah ada');
            }

            const dbData = {
                tindakanPengendalian: data.tindakanPengendalian,
                referensi: data.referensi || '',
                validasi: data.validasi,
                peluangKejadianBahaya: data.peluangSetelah,
                dampakKeparahan: data.dampakSetelah,
                skorRisiko: hitungSkorRisiko(data.peluangSetelah, data.dampakSetelah),
                deletedAt: null,
                tingkatRisiko: hitungTingkatRisiko(hitungSkorRisiko(data.peluangSetelah, data.dampakSetelah))

            };

            const kaji = await this.kajiUlangRisikoRepository.update({
                id: existing.id,
                data: dbData,
            });

            return {
                ...kaji,
                skorSetelah: kaji.skorRisiko,
                tingkatRisikoSetelah: hitungTingkatRisiko(kaji.skorRisiko),
            };
        }

        data.skorRisiko = hitungSkorRisiko(data.peluangKejadianBahaya, data.dampakKeparahan);
        data.tingkatRisiko = hitungTingkatRisiko(data.skorRisiko);
        data.id = `kaji-ulang-risiko-${nanoid()}`;

        const dbData = {
            id: `kaji-ulang-risiko-${nanoid()}`,
            penilaianRisikoId: data.penilaianRisikoId,
            tindakanPengendalian: data.tindakanPengendalian,
            referensi: data.referensi || '',
            validasi: data.validasi,
            peluangKejadianBahaya: data.peluangSetelah,
            dampakKeparahan: data.dampakSetelah,
            skorRisiko: hitungSkorRisiko(data.peluangSetelah, data.dampakSetelah),
            tingkatRisiko: hitungTingkatRisiko(hitungSkorRisiko(data.peluangSetelah, data.dampakSetelah))
        };


        const kaji = await this.kajiUlangRisikoRepository.create({ data: dbData });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'CREATE',
            namaTabel: NAMA_TABEL,
            recordId: kaji.id,
            keterangan: `Menambah data kaji ulang risiko `,
        });

        return {
            ...kaji,
            skorSetelah: kaji.skorRisiko,
            tingkatRisikoSetelah: hitungTingkatRisiko(kaji.skorRisiko),
        };
    }

    async findAll({ req }) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);
        const { search, tanpaRencanaPerbaikan, tanpaPemantauanOperasional, kodeLokasi, kodeRisiko, startDate, endDate } = req.query;


        const where = {
            deletedAt: null,
            ...(tanpaRencanaPerbaikan === 'true' && {
                OR: [
                    { rencanaPerbaikan: null },
                    { rencanaPerbaikan: { deletedAt: { not: null } } }
                ]
            }),
            ...(tanpaPemantauanOperasional === 'true' && {
                OR: [
                    { pemantauanOperasional: null },
                    { pemantauanOperasional: { deletedAt: { not: null } } }
                ]
            }),
            ...((kodeLokasi || kodeRisiko) && {
                penilaianRisiko: {
                    identifikasiDanKejadianBahaya: {
                        ...(kodeLokasi && { kodeLokasi: { startsWith: kodeLokasi, } }),
                        ...(kodeRisiko && { kodeRisiko: { startsWith: kodeRisiko, mode: 'insensitive' } }),
                    }
                }
            }),
            ...((startDate || endDate) && {
                createdAt: {
                    ...(startDate && { gte: new Date(startDate) }),
                    ...(endDate && { lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) }),
                }
            }),
            ...(search && {
                OR: [
                    { tindakanPengendalian: { contains: search, mode: 'insensitive' } },
                    { referensi: { contains: search, mode: 'insensitive' } },
                    { penilaianRisiko: { identifikasiDanKejadianBahaya: { kodeRisiko: { contains: search, mode: 'insensitive' } } } },
                    { penilaianRisiko: { identifikasiDanKejadianBahaya: { kejadianBahayaXYZ: { contains: search, mode: 'insensitive' } } } },
                    { penilaianRisiko: { identifikasiDanKejadianBahaya: { lokasiSpam: { kodeLokasi: { contains: search, mode: 'insensitive' } } } } },
                ],
            }),
        };

        let orderBy;
        if (sortBy === 'kodeRisiko') {
            orderBy = {
                penilaianRisiko: {
                    identifikasiDanKejadianBahaya: {
                        kodeRisiko: sortOrder
                    }
                }
            };
        } else {
            orderBy = { [sortBy]: sortOrder };
        }

        const [data, total] = await Promise.all([
            this.kajiUlangRisikoRepository.findAll({
                where,
                skip,
                take: limit,
                orderBy,
            }),
            this.kajiUlangRisikoRepository.count({ where }),
        ]);

        const enrichedData = data.map((item) => ({
            ...item,
            skorSetelah: item.skorRisiko,
            peluangSetelah: item.peluangKejadianBahaya,
            dampakSetelah: item.dampakKeparahan,
            tingkatRisikoSetelah: hitungTingkatRisiko(item.skorRisiko),
        }));

        return {
            items: enrichedData,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findById({ id }) {
        const kaji = await this.kajiUlangRisikoRepository.findById({ id });
        if (!kaji) throw new NotFoundError('Data tidak ditemukan');

        return {
            ...kaji,
            skorSetelah: kaji.skorRisiko,
            peluangSetelah: kaji.peluangKejadianBahaya,
            dampakSetelah: kaji.dampakKeparahan,
            tingkatRisikoSetelah: hitungTingkatRisiko(kaji.skorRisiko),
        };
    }

    async update({ id, data, userId }) {
        const existing = await this.kajiUlangRisikoRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data tidak ditemukan');

        data.skorRisiko = hitungSkorRisiko(data.peluangKejadianBahaya, data.dampakKeparahan);
        data.tingkatRisiko = hitungTingkatRisiko(data.skorRisiko);



        const dbData = {};
        if (data.penilaianRisikoId !== undefined) dbData.penilaianRisikoId = data.penilaianRisikoId;
        if (data.tindakanPengendalian !== undefined) dbData.tindakanPengendalian = data.tindakanPengendalian;
        if (data.referensi !== undefined) dbData.referensi = data.referensi || '';
        if (data.validasi !== undefined) dbData.validasi = data.validasi;

        const peluang = data.peluangSetelah !== undefined ? data.peluangSetelah : existing.peluangKejadianBahaya;
        const dampak = data.dampakSetelah !== undefined ? data.dampakSetelah : existing.dampakKeparahan;

        if (data.peluangSetelah !== undefined) dbData.peluangKejadianBahaya = data.peluangSetelah;
        if (data.dampakSetelah !== undefined) dbData.dampakKeparahan = data.dampakSetelah;

        dbData.skorRisiko = hitungSkorRisiko(peluang, dampak);

        const updated = await this.kajiUlangRisikoRepository.update({ id, data: dbData });

        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'UPDATE',
            namaTabel: NAMA_TABEL,
            recordId: updated.id,
            keterangan: `Mengubah data kaji ulang risiko `,
        });
        return {
            ...updated,
            skorSetelah: updated.skorRisiko,
            tingkatRisikoSetelah: hitungTingkatRisiko(updated.skorRisiko),
        };
    }

    async remove({ id, userId }) {
        const existing = await this.kajiUlangRisikoRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data tidak ditemukan');
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'DELETE',
            namaTabel: NAMA_TABEL,
            recordId: id,
            keterangan: `Menghapus data kaji ulang risiko `,
        });

        await this.kajiUlangRisikoRepository.cascadeSoftDelete({ id });
    }
}
