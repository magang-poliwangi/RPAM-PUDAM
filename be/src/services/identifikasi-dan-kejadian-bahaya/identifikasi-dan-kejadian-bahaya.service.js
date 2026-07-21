// identifikasiBahaya.service.js
import { nanoid } from 'nanoid';
import { NotFoundError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { catatAuditLog } from '../../utils/audit-log.helper.js';
import { generateKode, generateKodeRisiko } from '../../utils/generate-kode.js';

const NAMA_TABEL = 'identifikasi_dan_kejadian_bahaya';

export default class IdentifikasiDanKejadianBahayaService {
    constructor({ identifikasiDanKejadianBahayaRepository, auditLogRepository }) {
        this.identifikasiDanKejadianBahayaRepository = identifikasiDanKejadianBahayaRepository;
        this.auditLogRepository = auditLogRepository;
    }

    async create({ data, userId }) {
        data.id = `identifikasi-bahaya-${nanoid()}`;


        const lokasiSpam = await this.identifikasiDanKejadianBahayaRepository.findLokasiSpamById(data.lokasiSpamId);
        if (!lokasiSpam) throw new NotFoundError('Lokasi SPAM tidak ditemukan');


        const bahayaKontaminasi = await this.identifikasiDanKejadianBahayaRepository.findBahayaKontaminasiById(data.bahayaKontaminasiId);
        if (!bahayaKontaminasi) throw new NotFoundError('Bahaya kontaminasi tidak ditemukan');


        
        const prefixKodeRisiko = bahayaKontaminasi.kodeRisiko;
        const prefixKodeLokasi = lokasiSpam.kodeLokasi;;
        const lastNumberKodeRisiko = await this.identifikasiDanKejadianBahayaRepository.getLastKodeRisikoNumber(prefixKodeRisiko);
        const lastNumberKodeLokasi = await this.identifikasiDanKejadianBahayaRepository.getLastKodeLokasiNumber(prefixKodeLokasi);
        
        data.kodeLokasi = generateKode(prefixKodeLokasi, lastNumberKodeLokasi + 1)
        data.kodeRisiko = generateKodeRisiko(prefixKodeRisiko, lastNumberKodeRisiko + 1);

        const m3_1 = await this.identifikasiDanKejadianBahayaRepository.create({ data });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'CREATE',
            namaTabel: NAMA_TABEL,
            recordId: m3_1.id,
            keterangan: `Menambah data identifikasi bahaya ${data.kodeRisiko}`,
        });

        return m3_1;
    }

    async findAll({ req }) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);
        const { search, lokasiSpamId, kodeLokasi, kodeRisiko, tipeBahaya, tanpaPenilaianRisiko, startDate, endDate } = req.query;

        const where = {
            deletedAt: null,
            ...(lokasiSpamId && { lokasiSpamId }),
            ...(kodeLokasi && { kodeLokasi }),
            ...(kodeRisiko && { kodeRisiko }),
            ...(tipeBahaya && { tipeBahaya }),
            ...(tanpaPenilaianRisiko === 'true' && { penilaianRisiko: null }),
            ...((startDate || endDate) && {
                createdAt: {
                    ...(startDate && { gte: new Date(startDate) }),
                    ...(endDate && { lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) }),
                },
            }),
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

        await catatAuditLog(this.auditLogRepository, {
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
        await this.identifikasiDanKejadianBahayaRepository.cascadeSoftDelete({ id });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'DELETE',
            namaTabel: NAMA_TABEL,
            recordId: id,
            keterangan: `Menghapus data identifikasi bahaya ${existing.kodeRisiko}`,
        });
    }
}