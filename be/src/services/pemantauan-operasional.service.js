import { prisma } from '../databases/client.js';
import { NotFoundError, ConflictError, InvariantError } from '../exceptions/error.js';

const searchableFields = [
  'apaYangDimonitor',
  'dimana',
  'kapan',
  'bagaimana',
  'siapaYangMelakukan',
  'apaTindakanKoreksinya',
];

// Sertakan konteks M4 (dan turunan M3.5/M3.1) supaya FE bisa tampilkan
// info kejadian bahaya tanpa request tambahan.
const includeRelasi = {
  kajiUlangRisiko: {
    select: {
      id: true,
      tindakanPengendalian: true,
      validasi: true,
      penilaianRisiko: {
        select: {
          id: true,
          identifikasiBahaya: {
            select: {
              kodeRisiko: true,
              kejadianBahayaXYZ: true,
              lokasiSpam: { select: { kodeLokasi: true } },
            },
          },
        },
      },
    },
  },
};

const ensureKajiUlangRisikoTersedia = async (kajiUlangRisikoId, excludeId = null) => {
  const kajiUlangRisiko = await prisma.kajiUlangRisiko.findFirst({
    where: { id: kajiUlangRisikoId, deletedAt: null },
  });
  if (!kajiUlangRisiko) {
    throw new InvariantError('Kaji ulang risiko (M4) tidak ditemukan');
  }

  const existing = await prisma.pemantauanOperasional.findFirst({
    where: { kajiUlangRisikoId, deletedAt: null, ...(excludeId ? { id: { not: excludeId } } : {}) },
  });
  if (existing) {
    throw new ConflictError('Kaji ulang risiko ini sudah punya data pemantauan operasional');
  }
};

const createPemantauanOperasional = async (payload) => {
  await ensureKajiUlangRisikoTersedia(payload.kajiUlangRisikoId);

  return prisma.pemantauanOperasional.create({
    data: payload,
    include: includeRelasi,
  });
};

const getAllPemantauanOperasional = async ({
  search, kajiUlangRisikoId, sortBy, sortOrder, cursor, limit,
}) => {
  const where = {
    deletedAt: null,
    ...(kajiUlangRisikoId ? { kajiUlangRisikoId } : {}),
    ...(search
      ? { OR: searchableFields.map((field) => ({ [field]: { contains: search, mode: 'insensitive' } })) }
      : {}),
  };

  const items = await prisma.pemantauanOperasional.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: includeRelasi,
  });

  const hasNextPage = items.length > limit;
  const data = hasNextPage ? items.slice(0, limit) : items;
  const nextCursor = hasNextPage ? data[data.length - 1].id : null;

  return { data, nextCursor, hasNextPage };
};

const getPemantauanOperasionalById = async (id) => {
  const item = await prisma.pemantauanOperasional.findFirst({
    where: { id, deletedAt: null },
    include: includeRelasi,
  });
  if (!item) throw new NotFoundError('Data pemantauan operasional tidak ditemukan');
  return item;
};

const updatePemantauanOperasional = async (id, payload) => {
  const current = await getPemantauanOperasionalById(id);

  if (payload.kajiUlangRisikoId && payload.kajiUlangRisikoId !== current.kajiUlangRisikoId) {
    await ensureKajiUlangRisikoTersedia(payload.kajiUlangRisikoId, id);
  }

  const updated = await prisma.pemantauanOperasional.update({
    where: { id },
    data: payload,
    include: includeRelasi,
  });

  return { before: current, after: updated };
};

const deletePemantauanOperasional = async (id) => {
  const current = await getPemantauanOperasionalById(id);

  await prisma.pemantauanOperasional.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return current;
};

// Dropdown FR-22: kaji ulang risiko (M4) yang belum punya pemantauan operasional
const getDropdownKajiUlangRisiko = async () => prisma.kajiUlangRisiko.findMany({
  where: { deletedAt: null, pemantauanOperasional: null },
  select: {
    id: true,
    tindakanPengendalian: true,
    validasi: true,
    penilaianRisiko: {
      select: {
        identifikasiBahaya: {
          select: {
            kodeRisiko: true,
            kejadianBahayaXYZ: true,
            lokasiSpam: { select: { kodeLokasi: true } },
          },
        },
      },
    },
  },
});

export {
  createPemantauanOperasional,
  getAllPemantauanOperasional,
  getPemantauanOperasionalById,
  updatePemantauanOperasional,
  deletePemantauanOperasional,
  getDropdownKajiUlangRisiko,
};