// pemantauanOperasional.service.js
import { nanoid } from 'nanoid';
import { NotFoundError, ConflictError, InvariantError } from '../../exceptions/error.js';
import { getPaginationQuery } from '../../utils/pagination.js';
import { catatAuditLog } from '../../utils/audit-log.helper.js';
const NAMA_TABEL = 'pemantauan_operasional';
const searchableFields = [
  'apaYangDimonitor',
  'dimana',
  'kapan',
  'bagaimana',
  'siapaYangMelakukan',
  'apaTindakanKoreksinya',
];

export default class PemantauanOperasionalService {
  constructor({ pemantauanOperasionalRepository, kajiUlangRisikoRepository, auditLogRepository }) {
    this.pemantauanOperasionalRepository = pemantauanOperasionalRepository;
    this.kajiUlangRisikoRepository = kajiUlangRisikoRepository;
    this.auditLogRepository = auditLogRepository;
  }

  async _ensureKajiUlangRisikoTersedia(kajiUlangRisikoId, excludeId = null) {
    const kajiUlangRisiko = await this.kajiUlangRisikoRepository.findById({ id: kajiUlangRisikoId });
    if (!kajiUlangRisiko) {
      throw new InvariantError('Kaji ulang risiko (M4) tidak ditemukan');
    }

    const existing = await this.pemantauanOperasionalRepository.findByKajiUlangRisikoId({
      kajiUlangRisikoId,
      excludeId,
    });
    if (existing) {
      throw new ConflictError('Kaji ulang risiko ini sudah punya data pemantauan operasional');
    }
  }

  async create({ data, userId }) {
    data.id = `pemantauan-operasional-${nanoid()}`;
    await this._ensureKajiUlangRisikoTersedia(data.kajiUlangRisikoId);
    const result = await this.pemantauanOperasionalRepository.create({ data });

    await catatAuditLog(this.auditLogRepository, {
      userId,
      aksi: 'CREATE',
      namaTabel: NAMA_TABEL,
      recordId: result.id,
      keterangan: `Menambah data pemantauan operasional`,
    });

    return result;
  }

  async findAll({ req }) {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);
    const { search, kajiUlangRisikoId } = req.query;

    const where = {
      deletedAt: null,
      ...(kajiUlangRisikoId && { kajiUlangRisikoId }),
      ...(search && {
        OR: searchableFields.map((field) => ({ [field]: { contains: search, mode: 'insensitive' } })),
      }),
    };

    const [data, total] = await Promise.all([
      this.pemantauanOperasionalRepository.findAll({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.pemantauanOperasionalRepository.count({ where }),
    ]);

    return {
      items: data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById({ id }) {
    const item = await this.pemantauanOperasionalRepository.findById({ id });
    if (!item) throw new NotFoundError('Data pemantauan operasional tidak ditemukan');
    return item;
  }

  async update({ id, data, userId }) {
    const current = await this.findById({ id });

    if (data.kajiUlangRisikoId && data.kajiUlangRisikoId !== current.kajiUlangRisikoId) {
      await this._ensureKajiUlangRisikoTersedia(data.kajiUlangRisikoId, id);
    }

    const result = await this.pemantauanOperasionalRepository.update({ id, data });
    await catatAuditLog(this.auditLogRepository, {
      userId,
      aksi: 'UPDATE',
      namaTabel: NAMA_TABEL,
      recordId: result.id,
      keterangan: `Mengubah data pemantauan operasional`,
    });
    return result;
  }

  async remove({ id, userId }) {
    const current = await this.findById({ id });
    await this.pemantauanOperasionalRepository.softDelete({ id });

    await catatAuditLog(this.auditLogRepository, {
      userId,
      aksi: 'DELETE',
      namaTabel: NAMA_TABEL,
      recordId: id,
      keterangan: `Menghapus data pemantauan operasional`,
    });
    return current;
  }

  async getDropdownKajiUlangRisiko() {
    return this.pemantauanOperasionalRepository.findDropdownKajiUlangRisiko();
  }
}