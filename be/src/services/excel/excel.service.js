import ExcelJS from 'exceljs';
import { buildLokasiSpamSheet, parseLokasiSpamRows, SHEET_NAME as LOKASI_SHEET } from '../../utils/excel/lokasi-spam.sheet.js';
import { buildBahayaKontaminasiSheet, parseBahayaKontaminasiRows, SHEET_NAME as BAHAYA_SHEET } from '../../utils/excel/bahaya-kontaminasi.sheet.js';
import {
  buildIdentifikasiDanKejadianBahayaSheet,
  parseIdentifikasiDanKejadianBahayaRows,
  SHEET_NAME as M31_SHEET,
} from '../../utils/excel/identifikasi-dan-kejadian-bahaya.sheet.js';
import { buildPenilaianRisikoSheet, parsePenilaianRisikoRows, SHEET_NAME as M35_SHEET } from '../../utils/excel/penilaian-risiko.sheet.js';
import { buildKajiUlangRisikoSheet, parseKajiUlangRisikoRows, SHEET_NAME as M4_SHEET } from '../../utils/excel/kaji-ulang.sheet.js';
import { buildRencanaPerbaikanSheet, parseRencanaPerbaikanRows, SHEET_NAME as M5_SHEET } from '../../utils/excel/rencana-perbaikan.sheet.js';
import {
  buildPemantauanOperasionalSheet,
  parsePemantauanOperasionalRows,
  SHEET_NAME as M62_SHEET,
} from '../../utils/excel/pemantauan-operasional.sheet.js';
import { hitungSkorRisiko, hitungTingkatRisiko } from '../../utils/score-calculator.js';
import { catatAuditLog } from '../../utils/audit-log.helper.js';

const NAMA_TABEL = 'rpam_excel';

function toNumberOrNull(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

export default class ExcelService {
  constructor({ excelRepository, auditLogRepository }) {
    this.excelRepository = excelRepository;
    this.auditLogRepository = auditLogRepository;
  }

  // ============================= EXPORT =============================

  async generateWorkbook() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'RPAM';
    workbook.created = new Date();

    buildLokasiSpamSheet(workbook, await this.excelRepository.findAllLokasiSpam());
    buildBahayaKontaminasiSheet(workbook, await this.excelRepository.findAllBahayaKontaminasi());
    buildIdentifikasiDanKejadianBahayaSheet(workbook, await this.excelRepository.findAllIdentifikasiBahaya());
    buildPenilaianRisikoSheet(workbook, await this.excelRepository.findAllPenilaianRisiko());
    buildKajiUlangRisikoSheet(workbook, await this.excelRepository.findAllKajiUlangRisiko());
    buildRencanaPerbaikanSheet(workbook, await this.excelRepository.findAllRencanaPerbaikan());
    buildPemantauanOperasionalSheet(workbook, await this.excelRepository.findAllPemantauanOperasional());

    return workbook.xlsx.writeBuffer();
  }

  // ============================= IMPORT: per-sheet =============================

  async _importLokasiSpam(rows, errors) {
    for (const r of rows) {
      try {
        if (!r.kodeLokasi) throw new Error('Kode Lokasi wajib diisi');
        await this.excelRepository.upsertLokasiSpam({
          kodeLokasi: r.kodeLokasi,
          idPrefix: `lokasi-spam-${Date.now()}-${r.excelRowNumber}`,
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
        errors.push({ sheet: LOKASI_SHEET, baris: r.excelRowNumber, pesan: e.message });
      }
    }
  }

  async _importBahayaKontaminasi(rows, errors) {
    for (const r of rows) {
      try {
        if (!r.kodeRisiko) throw new Error('Kode Risiko (prefix) wajib diisi');
        await this.excelRepository.upsertBahayaKontaminasi({
          kodeRisiko: r.kodeRisiko,
          data: { tipeBahaya: r.tipeBahaya, kontaminasiX: r.kontaminasiX },
        });
      } catch (e) {
        errors.push({ sheet: BAHAYA_SHEET, baris: r.excelRowNumber, pesan: e.message });
      }
    }
  }

  async _importIdentifikasiBahaya(rows, errors) {
    for (const r of rows) {
      try {
        if (!r.kodeRisiko) throw new Error('Kode Risiko wajib diisi');
        if (!r.kodeLokasi) throw new Error('Kode Lokasi wajib diisi');

        // Kode Lokasi belum terdaftar -> auto-buat data master minimal, jangan gagalkan import
        let lokasi = await this.excelRepository.findLokasiByKode(r.kodeLokasi);
        if (!lokasi) {
          lokasi = await this.excelRepository.upsertLokasiSpam({
            kodeLokasi: r.kodeLokasi,
            idPrefix: `lokasi-spam-${Date.now()}-${r.excelRowNumber}`,
            data: {},
          });
        }

        // Sheet M3.1 format resmi cuma punya kolom "Kontaminasi (X)" + "Tipe Bahaya",
        // jadi BahayaKontaminasi di-resolve dari kombinasi keduanya, auto-buat kalau belum ada
        let bahaya = await this.excelRepository.findBahayaByKontaminasiXDanTipe({
          kontaminasiX: r.kontaminasiX,
          tipeBahaya: r.tipeBahaya,
        });
        if (!bahaya) {
          const prefix = String(r.tipeBahaya || 'X').trim().charAt(0).toUpperCase() || 'X';
          bahaya = await this.excelRepository.upsertBahayaKontaminasi({
            kodeRisiko: `${prefix}-${Date.now()}-${r.excelRowNumber}`,
            data: { tipeBahaya: r.tipeBahaya, kontaminasiX: r.kontaminasiX },
          });
        }

        await this.excelRepository.upsertIdentifikasiBahaya({
          kodeRisiko: r.kodeRisiko,
          idPrefix: `identifikasi-bahaya-${Date.now()}-${r.excelRowNumber}`,
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
        errors.push({ sheet: M31_SHEET, baris: r.excelRowNumber, pesan: e.message });
      }
    }
  }

  async _importPenilaianRisiko(rows, errors) {
    for (const r of rows) {
      try {
        if (!r.kodeRisiko) throw new Error('Kode Risiko wajib diisi');
        const identifikasi = await this.excelRepository.findIdentifikasiByKode(r.kodeRisiko);
        if (!identifikasi) throw new Error(`Identifikasi bahaya dengan Kode Risiko "${r.kodeRisiko}" tidak ditemukan — import sheet M3.1 dulu`);

        const peluang = toNumberOrNull(r.peluangKejadianBahaya);
        const dampak = toNumberOrNull(r.dampakKeparahan);
        const skor = toNumberOrNull(r.skorRisiko) ?? hitungSkorRisiko(peluang, dampak);
        const tingkat = r.tingkatRisiko || hitungTingkatRisiko(skor);

        await this.excelRepository.upsertPenilaianRisiko({
          identifikasiDanKejadianBahayaId: identifikasi.id,
          data: { peluangKejadianBahaya: peluang, dampakKeparahan: dampak, skorRisiko: skor, tingkatRisiko: tingkat },
        });
      } catch (e) {
        errors.push({ sheet: M35_SHEET, baris: r.excelRowNumber, pesan: e.message });
      }
    }
  }

  async _importKajiUlangRisiko(rows, errors) {
    for (const r of rows) {
      try {
        if (!r.kodeRisiko) throw new Error('Kode Risiko wajib diisi');
        const identifikasi = await this.excelRepository.findIdentifikasiWithPenilaianByKode(r.kodeRisiko);
        if (!identifikasi?.penilaianRisiko) throw new Error(`Penilaian risiko untuk Kode Risiko "${r.kodeRisiko}" belum ada — import sheet M3.5 dulu`);

        if (!r.validasi) throw new Error('Validasi wajib dicentang salah satu (Efektif / Tidak Efektif / Tidak Pasti)');

        const peluang = toNumberOrNull(r.peluangKejadianBahaya);
        const dampak = toNumberOrNull(r.dampakKeparahan);
        const skor = toNumberOrNull(r.skorRisiko) ?? hitungSkorRisiko(peluang, dampak);
        const tingkat = r.tingkatRisiko || hitungTingkatRisiko(skor);

        await this.excelRepository.upsertKajiUlangRisiko({
          penilaianRisikoId: identifikasi.penilaianRisiko.id,
          data: {
            tindakanPengendalian: r.tindakanPengendalian,
            referensi: r.referensi,
            validasi: r.validasi,
            peluangKejadianBahaya: peluang,
            dampakKeparahan: dampak,
            skorRisiko: skor,
            tingkatRisiko: tingkat,
          },
        });
      } catch (e) {
        errors.push({ sheet: M4_SHEET, baris: r.excelRowNumber, pesan: e.message });
      }
    }
  }

  async _importRencanaPerbaikan(rows, errors) {
    for (const r of rows) {
      try {
        if (!r.kodeRisiko) throw new Error('Kode Risiko wajib diisi');
        const kaji = await this.excelRepository.findKajiUlangByKodeRisiko(r.kodeRisiko);
        if (!kaji) throw new Error(`Kaji ulang risiko untuk Kode Risiko "${r.kodeRisiko}" tidak ditemukan — import sheet M4 dulu`);

        if (!r.prioritas) throw new Error('Skala Prioritas wajib dicentang salah satu (Pendek / Menengah / Panjang)');

        await this.excelRepository.upsertRencanaPerbaikan({
          kajiUlangRisikoId: kaji.id,
          data: {
            rencanaPerbaikan: r.rencanaPerbaikan,
            penanggungJawab: r.penanggungJawab,
            jadwalPelaksanaan: r.jadwalPelaksanaan,
            biaya: toNumberOrNull(r.biaya) ?? 0,
            sumberPembiayaan: r.sumberPembiayaan,
            statusKemajuan: r.statusKemajuan,
            kendalaKeuangan: r.kendalaKeuangan,
            kendalaTenagaKerja: r.kendalaTenagaKerja,
            prioritas: r.prioritas,
          },
        });
      } catch (e) {
        errors.push({ sheet: M5_SHEET, baris: r.excelRowNumber, pesan: e.message });
      }
    }
  }

  async _importPemantauanOperasional(rows, errors) {
    for (const r of rows) {
      try {
        if (!r.kodeRisiko) throw new Error('Kode Risiko wajib diisi');
        const kaji = await this.excelRepository.findKajiUlangByKodeRisiko(r.kodeRisiko);
        if (!kaji) throw new Error(`Kaji ulang risiko untuk Kode Risiko "${r.kodeRisiko}" tidak ditemukan — import sheet M4 dulu`);

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
        errors.push({ sheet: M62_SHEET, baris: r.excelRowNumber, pesan: e.message });
      }
    }
  }

  // ============================= IMPORT: orkestrasi =============================

  async importWorkbook({ fileBuffer, userId }) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    const errors = [];
    const summary = {};

    // urutan penting: master data dulu, baru modul turunan (FK saling bergantung)
    const plan = [
      [LOKASI_SHEET, parseLokasiSpamRows, this._importLokasiSpam.bind(this)],
      [BAHAYA_SHEET, parseBahayaKontaminasiRows, this._importBahayaKontaminasi.bind(this)],
      [M31_SHEET, parseIdentifikasiDanKejadianBahayaRows, this._importIdentifikasiBahaya.bind(this)],
      [M35_SHEET, parsePenilaianRisikoRows, this._importPenilaianRisiko.bind(this)],
      [M4_SHEET, parseKajiUlangRisikoRows, this._importKajiUlangRisiko.bind(this)],
      [M5_SHEET, parseRencanaPerbaikanRows, this._importRencanaPerbaikan.bind(this)],
      [M62_SHEET, parsePemantauanOperasionalRows, this._importPemantauanOperasional.bind(this)],
    ];

    for (const [sheetName, parseFn, importFn] of plan) {
      const sheet = workbook.getWorksheet(sheetName);
      if (!sheet) continue; // sheet nggak ada di file yang diupload -> lewati, bukan error

      const rows = parseFn(sheet);
      const errorsBefore = errors.length;
      await importFn(rows, errors);
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