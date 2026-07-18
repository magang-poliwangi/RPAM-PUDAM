
import { nanoid } from 'nanoid';
import { ConflictError, NotFoundError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { hitungSkorRisiko, hitungTingkatRisiko } from '../../utils/score-calculator.js';
import { catatAuditLog } from '../../utils/audit-log.helper.js';

const NAMA_TABEL = 'penilaian_risiko';

export default class PenilaianRisikoService {
    constructor({ penilaianRisikoRepository, auditLogRepository }) {
        this.penilaianRisikoRepository = penilaianRisikoRepository;
        this.auditLogRepository = auditLogRepository;
    }

    async create({ data, userId }) {
        const { identifikasiDanKejadianBahayaId, peluangKejadianBahaya, dampakKeparahan } = data;

        const existing = await this.penilaianRisikoRepository.findByIdentifikasiDanKejadianBahayaId({
            identifikasiDanKejadianBahayaId,
        });
        if (existing) {
            throw new ConflictError('Identifikasi bahaya ini sudah punya penilaian risiko');
        }

        data.skorRisiko = hitungSkorRisiko(peluangKejadianBahaya, dampakKeparahan);
        data.tingkatRisiko = hitungTingkatRisiko(data.skorRisiko);
        data.id = `penilaian-risiko-${nanoid()}`;

        const penilaian = await this.penilaianRisikoRepository.create({ data });

        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'CREATE',
            namaTabel: NAMA_TABEL,
            recordId: penilaian.id,
            keterangan: `Menambah data penilaian risiko`,
        });

        return {
            ...penilaian,
            tingkatRisiko: hitungTingkatRisiko(penilaian.skorRisiko),
        };
    }

    async findAll({ req }) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);

        const { search, tanpaKajiUlangRisiko, tingkatRisiko } = req.query;
        const where = {
            deletedAt: null,
            ...(tanpaKajiUlangRisiko === 'true' && { kajiUlangRisiko: null }),
            ...(tingkatRisiko && { tingkatRisiko }),
            ...(search && {
                OR: [
                    { identifikasiDanKejadianBahaya: { kodeRisiko: { contains: search, mode: 'insensitive' } } },
                    { identifikasiDanKejadianBahaya: { kejadianBahayaXYZ: { contains: search, mode: 'insensitive' } } },
                    { identifikasiDanKejadianBahaya: { lokasiSpam: { kodeLokasi: { contains: search, mode: 'insensitive' } } } },
                ],
            }),
        };


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
        data.tingkatRisiko = hitungTingkatRisiko(data.skorRisiko);

        const updated = await this.penilaianRisikoRepository.update({ id, data });

        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'UPDATE',
            namaTabel: NAMA_TABEL,
            recordId: updated.id,
            keterangan: `Mengubah data penilaian risiko`,
        });

        return {
            ...updated,
            tingkatRisiko: hitungTingkatRisiko(updated.skorRisiko),
        };
    }

    async remove({ id, userId }) {
        const existing = await this.penilaianRisikoRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data penilaian risiko tidak ditemukan');

        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'DELETE',
            namaTabel: NAMA_TABEL,
            recordId: id,
            keterangan: `Menghapus data penilaian risiko`,
        });

        await this.penilaianRisikoRepository.softDelete({ id });
    }
}