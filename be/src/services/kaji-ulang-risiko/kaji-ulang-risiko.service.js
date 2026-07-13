import { ConflictError, NotFoundError } from '../../exceptions/error.js';
import { hitungSkorRisiko, hitungTingkatRisiko, getPaginationQuery } from '../../utils/score-calculator.js';

export default class KajiUlangRisikoService {
    constructor({ kajiUlangRisikoRepository }) {
        this.kajiUlangRisikoRepository = kajiUlangRisikoRepository;
    }

    async create({ data, userId }) {
        const existing = await this.kajiUlangRisikoRepository.findByPenilaianRisikoId({
            penilaianRisikoId: data.penilaianRisikoId,
        });
        if (existing && !existing.deletedAt) {
            throw new ConflictError('Kaji Ulang Risiko untuk Penilaian ini sudah ada');
        }

        data.skorRisiko = hitungSkorRisiko(data.peluangKejadianBahaya, data.dampakKeparahan);

        const kaji = await this.kajiUlangRisikoRepository.create({ data });

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

        data.skorRisiko = hitungSkorRisiko(data.peluangKejadianBahaya, data.dampakKeparahan);

        const updated = await this.kajiUlangRisikoRepository.update({ id, data });

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
