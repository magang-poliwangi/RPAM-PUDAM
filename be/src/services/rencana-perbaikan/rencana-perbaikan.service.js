/* eslint-disable no-unused-vars */
import { nanoid } from 'nanoid';
import { ConflictError, NotFoundError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { hitungTingkatRisiko } from '../../utils/score-calculator.js';
import { catatAuditLog } from '../../utils/audit-log.helper.js';
const NAMA_TABEL = 'rencana_perbaikan';
export default class RencanaPerbaikanService {
    constructor({ rencanaPerbaikanRepository, auditLogRepository }) {
        this.rencanaPerbaikanRepository = rencanaPerbaikanRepository;
        this.auditLogRepository = auditLogRepository;
    }

    _mapPayload(data, isUpdate = false) {
        const mapped = { ...data };
        
        if (mapped.jadwal !== undefined) {
            mapped.jadwalPelaksanaan = mapped.jadwal || '';
            delete mapped.jadwal;
        } else if (!isUpdate && mapped.jadwalPelaksanaan === undefined) {
            mapped.jadwalPelaksanaan = '';
        }

        if (mapped.kendala !== undefined) {
            const kendalaStr = (mapped.kendala || '').toLowerCase();
            mapped.kendalaKeuangan = kendalaStr.includes('keuangan');
            mapped.kendalaTenagaKerja = kendalaStr.includes('tenaga') || kendalaStr.includes('kerja');
            delete mapped.kendala;
        }

        if (mapped.biaya === '' || mapped.biaya === null) {
            mapped.biaya = 0;
        }

        return mapped;
    }

    async create({ data, userId }) {
        const mappedData = this._mapPayload(data, false);
        const existing = await this.rencanaPerbaikanRepository.findByKajiUlangRisikoId({
            kajiUlangRisikoId: mappedData.kajiUlangRisikoId,
        });
        if (existing) {
            if (!existing.deletedAt) {
                throw new ConflictError('Rencana Perbaikan untuk Kaji Ulang ini sudah ada');
            }

            mappedData.deletedAt = null;
            const m5 = await this.rencanaPerbaikanRepository.update({
                id: existing.id,
                data: mappedData,
            });

            return m5;
        }
        mappedData.id = `rencana-perbaikan-${nanoid()}`;
    
        const m5 = await this.rencanaPerbaikanRepository.create({ data: mappedData });
        
        await catatAuditLog(this.auditLogRepository, {
                userId,
                aksi: 'CREATE',
                namaTabel: NAMA_TABEL,
                recordId: m5.id,
                keterangan: `Menambah data rencana perbaikan`,
        });
      
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


        const mappedData = this._mapPayload(data, true);
        const updated = await this.rencanaPerbaikanRepository.update({ id, data: mappedData });
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'UPDATE',
            namaTabel: NAMA_TABEL,
            recordId: updated.id,
            keterangan: `Mengubah data rencana perbaikan`,
        });
        return updated;
    }

    async remove({ id, userId }) {
        const existing = await this.rencanaPerbaikanRepository.findById({ id });
        if (!existing) throw new NotFoundError('Data tidak ditemukan');
        await catatAuditLog(this.auditLogRepository, {
            userId,
            aksi: 'DELETE',
            namaTabel: NAMA_TABEL,
            recordId: id,
            keterangan: `Menghapus data rencana perbaikan`,
        });
        await this.rencanaPerbaikanRepository.softDelete({ id });
    }
}
