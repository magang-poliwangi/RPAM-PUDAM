
import { nanoid } from 'nanoid';
import { ConflictError, NotFoundError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { hitungSkorRisiko, hitungTingkatRisiko } from '../../utils/score-calculator.js';

export default class PenilaianRisikoService {
    constructor({ penilaianRisikoRepository }) {
        this.penilaianRisikoRepository = penilaianRisikoRepository;
    }

    async create({ data, userId }) {
        const { identifikasiBahayaId, peluangKejadianBahaya, dampakKeparahan } = data;

        // relasi 1-ke-1 (@unique di schema) - cek dulu biar errornya jelas
        const existing = await this.penilaianRisikoRepository.findByIdentifikasiBahayaId({
            identifikasiBahayaId,
        });
        if (existing) {
            throw new ConflictError('Identifikasi bahaya ini sudah punya penilaian risiko');
        }

        data.skorRisiko = hitungSkorRisiko(peluangKejadianBahaya, dampakKeparahan);
        data.id = `penilaian-risiko-${nanoid()}`;

        const penilaian = await this.penilaianRisikoRepository.create({ data });

        return {
            ...penilaian,
            tingkatRisiko: hitungTingkatRisiko(penilaian.skorRisiko),
        };
    }

    async findAll({ req }) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);

        const where = { deletedAt: null };
        if (req.query.search) {
            where.identifikasiBahaya = {
                kodeRisiko: { contains: req.query.search, mode: 'insensitive' },
            };
        }
        if (req.query.identifikasiBahayaId) {
            where.identifikasiBahayaId = req.query.identifikasiBahayaId;
        }

        const [data, total] = await Promise.all([
            this.penilaianRisikoRepository.findAll({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.penilaianRisikoRepository.count({ where }),
        ]);

        const items = data.map((item) => ({
            ...item,
            tingkatRisiko: hitungTingkatRisiko(item.skorRisiko),
        }));

        return {
            items,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findById({ id }) {
        const penilaian = await this.penilaianRisikoRepository.findById({ id });
        if (!penilaian) throw new NotFoundError('Data penilaian risiko tidak ditemukan');

        return {
            ...penilaian,
            tingkatRisiko: hitungTingkatRisiko(penilaian.skorRisiko),
        };
    }

    async update({ id, data, userId }) {
        const existing = await this.penilaianRisikoRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data penilaian risiko tidak ditemukan');

        const peluang = data.peluangKejadianBahaya ?? existing.peluangKejadianBahaya;
        const dampak = data.dampakKeparahan ?? existing.dampakKeparahan;
        data.skorRisiko = hitungSkorRisiko(peluang, dampak);

        const updated = await this.penilaianRisikoRepository.update({ id, data });

        return {
            ...updated,
            tingkatRisiko: hitungTingkatRisiko(updated.skorRisiko),
        };
    }

    async remove({ id, userId }) {
        const existing = await this.penilaianRisikoRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data penilaian risiko tidak ditemukan');

        await this.penilaianRisikoRepository.softDelete({ id });
    }
}