import { Router } from 'express';
import { prisma } from '../databases/client.js';
import response from '../utils/response.js';
import validate from '../middlewares/validate.js';
import authenticateToken from '../middlewares/authenticate-token.js';
import {
  createPemantauanOperasionalSchema,
  updatePemantauanOperasionalSchema,
  listPemantauanOperasionalQuerySchema,
  idParamSchema,
} from '../validations/pemantauan-operasional.validation.js';
import {
  createPemantauanOperasional,
  getAllPemantauanOperasional,
  getPemantauanOperasionalById,
  updatePemantauanOperasional,
  deletePemantauanOperasional,
  getDropdownKajiUlangRisiko,
} from '../services/pemantauan-operasional.service.js';

const router = Router();

// Semua endpoint modul ini wajib login (Admin & User sama-sama boleh CRUD data RPAM)
router.use(authenticateToken);

const catatAuditLog = (req, aksi, recordId, oldValue, newValue) => prisma.auditLog.create({
  data: {
    userId: req.user.id,
    aksi,
    namaTabel: 'pemantauan_operasional',
    recordId,
    oldValue: oldValue ?? undefined,
    newValue: newValue ?? undefined,
  },
});

// Catatan: middleware `validate` di repo ini cuma simpan 1 nilai di `req.validated`,
// jadi kalau route butuh validasi `params` DAN `body` sekaligus, jangan chain 2x
// `validate()` (yang kedua akan menimpa hasil pertama). `:id` divalidasi manual lewat
// helper ini, sementara `req.validated` tetap dipakai khusus untuk body/query.
const validasiId = (req, res, next) => {
  const { error } = idParamSchema.validate({ id: req.params.id });
  if (error) return next(error);
  return next();
};

// Dropdown relasi M4 (kaji ulang risiko yang belum dipantau) — taruh sebelum /:id
router.get('/dropdown/kaji-ulang-risiko', async (req, res, next) => {
  try {
    const data = await getDropdownKajiUlangRisiko();
    return response(res, 200, 'Daftar kaji ulang risiko tersedia', data);
  } catch (error) {
    return next(error);
  }
});

router.get('/', validate(listPemantauanOperasionalQuerySchema, 'query'), async (req, res, next) => {
  try {
    const result = await getAllPemantauanOperasional(req.validated);
    return response(res, 200, 'Daftar pemantauan operasional', result);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', validasiId, async (req, res, next) => {
  try {
    const data = await getPemantauanOperasionalById(req.params.id);
    return response(res, 200, 'Detail pemantauan operasional', data);
  } catch (error) {
    return next(error);
  }
});

router.post('/', validate(createPemantauanOperasionalSchema), async (req, res, next) => {
  try {
    const data = await createPemantauanOperasional(req.validated);
    await catatAuditLog(req, 'CREATE', data.id, null, data);
    return response(res, 201, 'Pemantauan operasional berhasil dibuat', data);
  } catch (error) {
    return next(error);
  }
});

router.put(
  '/:id',
  validasiId,
  validate(updatePemantauanOperasionalSchema),
  async (req, res, next) => {
    try {
      const { before, after } = await updatePemantauanOperasional(req.params.id, req.validated);
      await catatAuditLog(req, 'UPDATE', after.id, before, after);
      return response(res, 200, 'Pemantauan operasional berhasil diperbarui', after);
    } catch (error) {
      return next(error);
    }
  },
);

router.delete('/:id', validasiId, async (req, res, next) => {
  try {
    const deleted = await deletePemantauanOperasional(req.params.id);
    await catatAuditLog(req, 'DELETE', deleted.id, deleted, null);
    return response(res, 200, 'Pemantauan operasional berhasil dihapus', null);
  } catch (error) {
    return next(error);
  }
});

export default router;