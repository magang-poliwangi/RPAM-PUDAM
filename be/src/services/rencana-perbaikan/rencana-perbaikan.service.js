import { nanoid } from 'nanoid';
import { ConflictError, NotFoundError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { hitungTingkatRisiko } from '../../utils/score-calculator.js';

export default class RencanaPerbaikanService {
    constructor({ rencanaPerbaikanRepository }) {
        this.rencanaPerbaikanRepository = rencanaPerbaikanRepository;
    }

    async create({ data, userId }) {
        const existing = await this.rencanaPerbaikanRepository.findByKajiUlangRisikoId({
            kajiUlangRisikoId: data.kajiUlangRisikoId,
        });
        if (existing && !existing.deletedAt) {
            throw new ConflictError('Rencana Perbaikan untuk Kaji Ulang ini sudah ada');
        }
        data.id = `rencana-perbaikan-${nanoid()}`;

        const m5 = await this.rencanaPerbaikanRepository.create({ data });

        return m5;
    }

    async findAll({ req }) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);

        const where = { deletedAt: null };
        if (req.query.search) {
            where.rencanaPerbaikan = { contains: req.query.search, mode: 'insensitive' };
        }

        const [data, total] = await Promise.all([
            this.rencanaPerbaikanRepository.findAll({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.rencanaPerbaikanRepository.count({ where }),
        ]);
        // 
        const items = data.map((item) => ({
            ...item,
            tingkatRisikoDenganPengendalian: hitungTingkatRisiko(item.kajiUlangRisiko),
        }));


        return {
            items,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findById({ id }) {
        const m5 = await this.rencanaPerbaikanRepository.findById({ id });
        if (!m5) throw new NotFoundError('Data tidak ditemukan');
        return m5;
    }

    async update({ id, data, userId }) {
        const existing = await this.rencanaPerbaikanRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data tidak ditemukan');

        const updated = await this.rencanaPerbaikanRepository.update({ id, data });

        return updated;
    }

    async remove({ id, userId }) {
        const existing = await this.rencanaPerbaikanRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data tidak ditemukan');

        await this.rencanaPerbaikanRepository.softDelete({ id });
    }
}
