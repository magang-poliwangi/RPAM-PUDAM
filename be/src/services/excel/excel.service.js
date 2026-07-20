import XLSX from 'xlsx';
import { catatAuditLog } from '../../utils/audit-log.helper.js';
import { hitungSkorRisiko, hitungTingkatRisiko } from '../../utils/score-calculator.js';
import { SHEET_DEFINITIONS } from '../../utils/excel/sheet-definitions.js';

const NAMA_TABEL = 'rpam_excel';

const IMPORT_ORDER = [
  'Lokasi SPAM',
  'Bahaya Kontaminasi',
  'Identifikasi Bahaya',
  'Penilaian Risiko',
  'Kaji Ulang Risiko',
  'Rencana Perbaikan',
  'Pemantauan Operasional',
];

function parseBoolean(v) {
  return String(v).trim().toUpperCase() === 'YA';
}

export default class ExcelService {
  constructor({ excelRepository, auditLogRepository }) {
    this.excelRepository = excelRepository;
    this.auditLogRepository = auditLogRepository;

    // map nama sheet -> fetcher, dipetakan dari method repository
    this.fetchers = {
      'Lokasi SPAM': () => this.excelRepository.findAllLokasiSpam(),
      'Bahaya Kontaminasi': () => this.excelRepository.findAllBahayaKontaminasi(),
      'Identifikasi Bahaya': () => this.excelRepository.findAllIdentifikasiBahaya(),
      'Penilaian Risiko': () => this.excelRepository.findAllPenilaianRisiko(),
      'Kaji Ulang Risiko': () => this.excelRepository.findAllKajiUlangRisiko(),
      'Rencana Perbaikan': () => this.excelRepository.findAllRencanaPerbaikan(),
      'Pemantauan Operasional': () => this.excelRepository.findAllPemantauanOperasional(),
    };


    this.importers = {
      'Lokasi SPAM': this._importLokasiSpam.bind(this),
      'Bahaya Kontaminasi': this._importBahayaKontaminasi.bind(this),
      'Identifikasi Bahaya': this._importIdentifikasiBahaya.bind(this),
      'Penilaian Risiko': this._importPenilaianRisiko.bind(this),
      'Kaji Ulang Risiko': this._importKajiUlangRisiko.bind(this),
      'Rencana Perbaikan': this._importRencanaPerbaikan.bind(this),
      'Pemantauan Operasional': this._importPemantauanOperasional.bind(this),
    };
  }

  //  EXPORT 

  async generateWorkbook() {
    const workbook = XLSX.utils.book_new();

    for (const def of SHEET_DEFINITIONS) {
      const rows = await this.fetchers[def.sheet]();
      const flatRows = rows.map(def.flatten);

      const worksheet = flatRows.length > 0
        ? XLSX.utils.json_to_sheet(flatRows, { header: def.columns })
        : XLSX.utils.aoa_to_sheet([def.columns]);

      XLSX.utils.book_append_sheet(workbook, worksheet, def.sheet);
    }

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  //  IMPORT: per-sheet 

  async _importLokasiSpam(rows, errors) {
    for (const [i, r] of rows.entries()) {
      try {
        if (!r.kodeLokasi) throw new Error('kodeLokasi wajib diisi');
        await this.excelRepository.upsertLokasiSpam({
          kodeLokasi: r.kodeLokasi,
          idPrefix: `lokasi-spam-${Date.now()}-${i}`,
          data: {
            simbol: r.simbol || null,
            namaLokasi: r.namaLokasi || null,
            deskripsi: r.deskripsi || null,
            penanggungJawabNama: r.penanggungJawabNama || null,
            penanggungJawabPosisi: r.penanggungJawabPosisi || null,
            penanggungJawabTelepon: r.penanggungJawabTelepon || null,
            penanggungJawabEmail: r.penanggungJawabEmail || null,
            referensi: r.referensi || null,
          },
        });
      } catch (e) {
        errors.push({ sheet: 'Lokasi SPAM', baris: i + 2, pesan: e.message });
      }
    }
  }

  async _importBahayaKontaminasi(rows, errors) {
    for (const [i, r] of rows.entries()) {
      try {
        if (!r.kodeRisiko) throw new Error('kodeRisiko (prefix) wajib diisi');
        await this.excelRepository.upsertBahayaKontaminasi({
          kodeRisiko: r.kodeRisiko,
          data: { tipeBahaya: r.tipeBahaya, kontaminasiX: r.kontaminasiX },
        });
      } catch (e) {
        errors.push({ sheet: 'Bahaya Kontaminasi', baris: i + 2, pesan: e.message });
      }
    }
  }

  async _importIdentifikasiBahaya(rows, errors) {
    for (const [i, r] of rows.entries()) {
      try {
        if (!r.kodeRisiko) throw new Error('kodeRisiko wajib diisi');

        const lokasi = await this.excelRepository.findLokasiByKode(r.kodeLokasi);
        if (!lokasi) throw new Error(`Lokasi dengan kodeLokasi "${r.kodeLokasi}" tidak ditemukan — pastikan sheet "Lokasi SPAM" diimport lebih dulu`);

        const bahaya = await this.excelRepository.findBahayaByKode(r.prefixBahayaKontaminasi);
        if (!bahaya) throw new Error(`Bahaya kontaminasi dengan prefix "${r.prefixBahayaKontaminasi}" tidak ditemukan`);

        await this.excelRepository.upsertIdentifikasiBahaya({
          kodeRisiko: r.kodeRisiko,
          idPrefix: `identifikasi-bahaya-${Date.now()}-${i}`,
          data: {
            lokasiSpamId: lokasi.id,
            bahayaKontaminasiId: bahaya.id,
            kodeLokasi: lokasi.kodeLokasi,
            komponenSpam: r.komponenSpam,
            komponenSpamY: r.komponenSpamY,
            penyebabZ: r.penyebabZ,
            kejadianBahayaXYZ: r.kejadianBahayaXYZ,
          },
        });
      } catch (e) {
        errors.push({ sheet: 'Identifikasi Bahaya', baris: i + 2, pesan: e.message });
      }
    }
  }
  // NOTE: upsert `where: { kodeRisiko }` di atas cuma valid kalau kodeRisiko
  // pada model IdentifikasiDanKejadianBahaya diberi `@unique` di schema.

  async _importPenilaianRisiko(rows, errors) {
    for (const [i, r] of rows.entries()) {
      try {
        if (!r.kodeRisiko) throw new Error('kodeRisiko wajib diisi');
        const identifikasi = await this.excelRepository.findIdentifikasiByKode(r.kodeRisiko);
        if (!identifikasi) throw new Error(`Identifikasi bahaya dengan kodeRisiko "${r.kodeRisiko}" tidak ditemukan`);

        const skor = r.skorRisiko || hitungSkorRisiko(r.peluangKejadianBahaya, r.dampakKeparahan);
        const tingkat = r.tingkatRisiko || hitungTingkatRisiko(skor);

        await this.excelRepository.upsertPenilaianRisiko({
          identifikasiDanKejadianBahayaId: identifikasi.id,
          data: {
            peluangKejadianBahaya: Number(r.peluangKejadianBahaya),
            dampakKeparahan: Number(r.dampakKeparahan),
            skorRisiko: skor,
            tingkatRisiko: tingkat,
          },
        });
      } catch (e) {
        errors.push({ sheet: 'Penilaian Risiko', baris: i + 2, pesan: e.message });
      }
    }
  }

  async _importKajiUlangRisiko(rows, errors) {
    for (const [i, r] of rows.entries()) {
      try {
        if (!r.kodeRisiko) throw new Error('kodeRisiko wajib diisi');
        const identifikasi = await this.excelRepository.findIdentifikasiWithPenilaianByKode(r.kodeRisiko);
        if (!identifikasi?.penilaianRisiko) throw new Error(`Penilaian risiko untuk kodeRisiko "${r.kodeRisiko}" belum ada — import sheet "Penilaian Risiko" dulu`);

        const skor = r.skorRisiko || hitungSkorRisiko(r.peluangKejadianBahaya, r.dampakKeparahan);
        const tingkat = r.tingkatRisiko || hitungTingkatRisiko(skor);

        await this.excelRepository.upsertKajiUlangRisiko({
          penilaianRisikoId: identifikasi.penilaianRisiko.id,
          data: {
            tindakanPengendalian: r.tindakanPengendalian,
            referensi: r.referensi,
            validasi: r.validasi,
            peluangKejadianBahaya: Number(r.peluangKejadianBahaya),
            dampakKeparahan: Number(r.dampakKeparahan),
            skorRisiko: skor,
            tingkatRisiko: tingkat,
          },
        });
      } catch (e) {
        errors.push({ sheet: 'Kaji Ulang Risiko', baris: i + 2, pesan: e.message });
      }
    }
  }

  async _importRencanaPerbaikan(rows, errors) {
    for (const [i, r] of rows.entries()) {
      try {
        if (!r.kodeRisiko) throw new Error('kodeRisiko wajib diisi');
        const kaji = await this.excelRepository.findKajiUlangByKodeRisiko(r.kodeRisiko);
        if (!kaji) throw new Error(`Kaji ulang risiko untuk kodeRisiko "${r.kodeRisiko}" tidak ditemukan`);

        await this.excelRepository.upsertRencanaPerbaikan({
          kajiUlangRisikoId: kaji.id,
          data: {
            rencanaPerbaikan: r.rencanaPerbaikan,
            penanggungJawab: r.penanggungJawab,
            jadwalPelaksanaan: r.jadwalPelaksanaan,
            biaya: Number(r.biaya),
            sumberPembiayaan: r.sumberPembiayaan,
            statusKemajuan: r.statusKemajuan,
            kendalaKeuangan: parseBoolean(r.kendalaKeuangan),
            kendalaTenagaKerja: parseBoolean(r.kendalaTenagaKerja),
            prioritas: r.prioritas,
          },
        });
      } catch (e) {
        errors.push({ sheet: 'Rencana Perbaikan', baris: i + 2, pesan: e.message });
      }
    }
  }

  async _importPemantauanOperasional(rows, errors) {
    for (const [i, r] of rows.entries()) {
      try {
        if (!r.kodeRisiko) throw new Error('kodeRisiko wajib diisi');
        const kaji = await this.excelRepository.findKajiUlangByKodeRisiko(r.kodeRisiko);
        if (!kaji) throw new Error(`Kaji ulang risiko untuk kodeRisiko "${r.kodeRisiko}" tidak ditemukan`);

        await this.excelRepository.upsertPemantauanOperasional({
          kajiUlangRisikoId: kaji.id,
          data: {
            batasKritis: r.batasKritis || null,
            apaYangDimonitor: r.apaYangDimonitor,
            dimana: r.dimana,
            kapan: r.kapan,
            bagaimana: r.bagaimana,
            siapaYangMelakukan: r.siapaYangMelakukan,
            siapaYangAkanMenganalisisHasilnya: r.siapaYangAkanMenganalisisHasilnya,
            siapaYangMenerimaHasilAnalisisDanMengambilTindakan: r.siapaYangMenerimaHasilAnalisisDanMengambilTindakan,
            apaTindakanKoreksinya: r.apaTindakanKoreksinya,
            siapaYangMelakukanTindakanKoreksi: r.siapaYangMelakukanTindakanKoreksi,
            seberapaCepat: r.seberapaCepat,
            siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni: r.siapaYangWajibMenerimaLaporanUntukTindakanKoreksiIni,
          },
        });
      } catch (e) {
        errors.push({ sheet: 'Pemantauan Operasional', baris: i + 2, pesan: e.message });
      }
    }
  }

  //  IMPORT 

  async importWorkbook({ fileBuffer, userId }) {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const errors = [];
    const summary = {};

    for (const sheetName of IMPORT_ORDER) {
      if (!workbook.SheetNames.includes(sheetName)) continue;

      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const errorsBefore = errors.length;
      await this.importers[sheetName](rows, errors);
      summary[sheetName] = { total: rows.length, gagal: errors.length - errorsBefore };
    }

    const totalGagal = errors.length;
    const totalBaris = Object.values(summary).reduce((acc, s) => acc + s.total, 0);

    await catatAuditLog(this.auditLogRepository, {
      userId,
      aksi: 'CREATE',
      namaTabel: NAMA_TABEL,
      recordId: null,
      keterangan: `Import Excel RPAM: ${totalBaris} baris diproses, ${totalGagal} gagal`,
    });

    return { summary, errors };
  }
}