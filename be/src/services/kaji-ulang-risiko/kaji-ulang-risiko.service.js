/* eslint-disable no-unused-vars */
import { nanoid } from 'nanoid';
import { ConflictError, NotFoundError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { hitungSkorRisiko, hitungTingkatRisiko } from '../../utils/score-calculator.js';

export default class KajiUlangRisikoService {
    constructor({ kajiUlangRisikoRepository }) {
        this.kajiUlangRisikoRepository = kajiUlangRisikoRepository;
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

        const dbData = {
            id: `kaji-ulang-risiko-${nanoid()}`,
            penilaianRisikoId: data.penilaianRisikoId,
            tindakanPengendalian: data.tindakanPengendalian,
            referensi: data.referensi || '',
            validasi: data.validasi,
            peluangKejadianBahaya: data.peluangSetelah,
            dampakKeparahan: data.dampakSetelah,
            skorRisiko: hitungSkorRisiko(data.peluangSetelah, data.dampakSetelah),
        };

        const kaji = await this.kajiUlangRisikoRepository.create({ data: dbData });

        return {
            ...kaji,
            skorSetelah: kaji.skorRisiko,
            tingkatRisikoSetelah: hitungTingkatRisiko(kaji.skorRisiko),
        };
    }

    async findAll({ req }) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);

        const where = { deletedAt: null };
        if (req.query.search) {
            where.tindakanPengendalian = { contains: req.query.search, mode: 'insensitive' };
        }

        const [data, total] = await Promise.all([
            this.kajiUlangRisikoRepository.findAll({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
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

        return {
            ...updated,
            skorSetelah: updated.skorRisiko,
            tingkatRisikoSetelah: hitungTingkatRisiko(updated.skorRisiko),
        };
    }

    async remove({ id, userId }) {
        const existing = await this.kajiUlangRisikoRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data tidak ditemukan');

        await this.kajiUlangRisikoRepository.softDelete({ id });
    }
}
