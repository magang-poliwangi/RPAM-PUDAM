// identifikasiBahaya.service.js
import { nanoid } from 'nanoid';
import { NotFoundError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { catatAuditLog } from '../../utils/audit-log.helper.js';


const NAMA_TABEL = 'identifikasi_dan_kejadian_bahaya';

export default class IdentifikasiDanKejadianBahayaService {
    constructor({ identifikasiDanKejadianBahayaRepository, auditLogRepository }) {
        this.identifikasiDanKejadianBahayaRepository = identifikasiDanKejadianBahayaRepository;
        this.auditLogRepository = auditLogRepository;
    }

    async create({ data, userId }) {
        data.id = `identifikasi-bahaya-${nanoid()}`;
   
        
        const m3_1 = await this.identifikasiDanKejadianBahayaRepository.create({ data });
        console.log('tes :' + userId);
        
        await catatAuditLog(this.auditLogRepository,{
            userId,
            aksi: 'CREATE',
            namaTabel: NAMA_TABEL,
            recordId: m3_1.id,
            keterangan: `Menambah data identifikasi bahaya `,
        });

        return m3_1;
    }

    async findAll({ req }) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);
        const { search, lokasiSpamId, tipeBahaya, tanpaPenilaianRisiko } = req.query;

        const where = {
            deletedAt: null,
            ...(lokasiSpamId && { lokasiSpamId }),
            ...(tipeBahaya && { tipeBahaya }),
            ...(tanpaPenilaianRisiko === 'true' && { penilaianRisiko: null }),
            ...(search && {
                OR: [
                    { kodeRisiko: { contains: search, mode: 'insensitive' } },
                    { kejadianBahayaXYZ: { contains: search, mode: 'insensitive' } },
                    { komponenSpam: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [data, total] = await Promise.all([
            this.identifikasiDanKejadianBahayaRepository.findAll({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.identifikasiDanKejadianBahayaRepository.count({ where }),
        ]);

        return {
            items: data,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findById({ id }) {
        const m3_1 = await this.identifikasiDanKejadianBahayaRepository.findById({ id });
        if (!m3_1) throw new NotFoundError('Data identifikasi bahaya tidak ditemukan');
        return m3_1;
    }

    async update({ id, data, userId }) {
        const existing = await this.identifikasiDanKejadianBahayaRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data identifikasi bahaya tidak ditemukan');

        const updated = await this.identifikasiDanKejadianBahayaRepository.update({ id, data });

        await catatAuditLog(this.auditLogRepository,{
            userId,
            aksi: 'UPDATE',
            namaTabel: NAMA_TABEL,
            recordId: updated.id,
            keterangan: `Mengubah data identifikasi bahaya`,
        });

        return updated;
    }

    async remove({ id, userId }) {
        const existing = await this.identifikasiDanKejadianBahayaRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data identifikasi bahaya tidak ditemukan');
        await this.identifikasiDanKejadianBahayaRepository.softDelete({ id });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'CREATE',
            namaTabel: NAMA_TABEL,
            recordId: id,
            keterangan: `Menambah data lokasi spam`,
        });


    }
}