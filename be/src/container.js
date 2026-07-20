import AuthController from './services/auth/auth.controller.js';
import AuthRepository from './services/auth/auth.repository.js';
import AuthService from './services/auth/auth.service.js';

import UserRepository from './services/user/user.repository.js';
import UserService from './services/user/user.service.js';
import UserController from './services/user/user.controller.js';

import KajiUlangRisikoRepository from './services/kaji-ulang-risiko/kaji-ulang-risiko.repository.js';
import KajiUlangRisikoService from './services/kaji-ulang-risiko/kaji-ulang-risiko.service.js';
import KajiUlangRisikoController from './services/kaji-ulang-risiko/kaji-ulang-risiko.controller.js';

import RencanaPerbaikanRepository from './services/rencana-perbaikan/rencana-perbaikan.repository.js';
import RencanaPerbaikanService from './services/rencana-perbaikan/rencana-perbaikan.service.js';
import RencanaPerbaikanController from './services/rencana-perbaikan/rencana-perbaikan.controller.js';
import PemantauanOperasionalRepository from './services/pemantauan-operasional/pemantauan-operasional.repository.js';
import PemantauanOperasionalService from './services/pemantauan-operasional/pemantauan-operasional.service.js';
import PemantauanOperasionalController from './services/pemantauan-operasional/pemantauan-operasional.controller.js';
import PenilaianRisikoService from './services/penilaian-risiko/penilaian-risiko.service.js';
import PenilaianRisikoRepository from './services/penilaian-risiko/penilaian-risiko.repository.js';
import PenilaianRisikoController from './services/penilaian-risiko/penilaian-risiko.controller.js';
import IdentifikasiDanKejadianBahayaRepository from './services/identifikasi-dan-kejadian-bahaya/identifikasi-dan-kejadian-bahaya.repository.js';
import IdentifikasiDanKejadianBahayaService from './services/identifikasi-dan-kejadian-bahaya/identifikasi-dan-kejadian-bahaya.service.js';
import IdentifikasiDanKejadianBahayaController from './services/identifikasi-dan-kejadian-bahaya/identifikasi-dan-kejadian-bahaya.controller.js';
import LokasiSpamRepository from './services/lokasi-spam/lokasi-spam.repository.js';
import LokasiSpamService from './services/lokasi-spam/lokasi-spam.service.js';
import LokasiSpamController from './services/lokasi-spam/lokasi-spam.controller.js';
import AuditLogRepository from './services/audit-log/audit-log.repository.js';
import AuditLogService from './services/audit-log/audit-log.service.js';
import AuditLogController from './services/audit-log/audit-log.controller.js';
import BahayaKontaminasiController from './services/bahaya-kontaminasi/bahaya-kontaminasi.controller.js';
import BahayaKontaminasiService from './services/bahaya-kontaminasi/bahaya-kontaminasi.service.js';
import BahayaKontaminasiRepository from './services/bahaya-kontaminasi/bahaya-kontaminasi.repository.js';
import ExcelRepository from './services/excel/excel.repository.js';
import ExcelService from './services/excel/excel.service.js';
import ExcelController from './services/excel/excel.controller.js';

// Repositories
const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const kajiUlangRisikoRepository = new KajiUlangRisikoRepository();
const rencanaPerbaikanRepository = new RencanaPerbaikanRepository();
const pemantauanOperasionalRepository = new PemantauanOperasionalRepository();
const identifikasiDanKejadianBahayaRepository = new IdentifikasiDanKejadianBahayaRepository();
const penilaianRisikoRepository = new PenilaianRisikoRepository();
const lokasiSpamRepository = new LokasiSpamRepository();
const auditLogRepository = new AuditLogRepository();
const bahayaKontaminasiRepository = new BahayaKontaminasiRepository();
const excelRepository = new ExcelRepository();

// Auth
const authService = new AuthService({ authRepository, userRepository, auditLogRepository });
export const authController = new AuthController({ authService });

// User
export const userService = new UserService({ userRepository, auditLogRepository });
export const userController = new UserController({ userService });

//bahaya kontaminasi
const bahayaKontaminasiService = new BahayaKontaminasiService({ auditLogRepository, bahayaKontaminasiRepository });
export const bahayaKontaminasiController = new BahayaKontaminasiController({ bahayaKontaminasiService });

//lokasi spam
const lokasiSpamService = new LokasiSpamService({ lokasiSpamRepository, auditLogRepository });
export const lokasiSpamController = new LokasiSpamController({ lokasiSpamService });

//identifikasi bahaya
const identifikasiDanKejadianBahayaService = new IdentifikasiDanKejadianBahayaService({ identifikasiDanKejadianBahayaRepository, auditLogRepository });
export const identifikasiDanKejadianBahayaController = new IdentifikasiDanKejadianBahayaController({ identifikasiDanKejadianBahayaService });

// Kaji Ulang Risiko
const kajiUlangRisikoService = new KajiUlangRisikoService({ kajiUlangRisikoRepository, auditLogRepository });
export const kajiUlangRisikoController = new KajiUlangRisikoController({ kajiUlangRisikoService });

//penilaian risiko
const penilaianRisikoService = new PenilaianRisikoService({ penilaianRisikoRepository, auditLogRepository });
export const penilaianRisikoController = new PenilaianRisikoController({ penilaianRisikoService });

// Rencana Perbaikan
const rencanaPerbaikanService = new RencanaPerbaikanService({ rencanaPerbaikanRepository, auditLogRepository });
export const rencanaPerbaikanController = new RencanaPerbaikanController({ rencanaPerbaikanService });

// Pemantuan Operasional
const pemantauanOperasionalService = new PemantauanOperasionalService({ kajiUlangRisikoRepository, pemantauanOperasionalRepository, auditLogRepository });
export const pemantauanOperasionalController = new PemantauanOperasionalController({ pemantauanOperasionalService });



//log 
const auditLogService = new AuditLogService({ auditLogRepository });
export const auditLogController = new AuditLogController({ auditLogService });

//excel 
const excelService = new ExcelService({auditLogRepository,excelRepository});
export const excelController = new ExcelController({excelService});