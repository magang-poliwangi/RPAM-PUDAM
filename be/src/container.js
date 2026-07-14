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

// Repositories
const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const kajiUlangRisikoRepository = new KajiUlangRisikoRepository();
const rencanaPerbaikanRepository = new RencanaPerbaikanRepository();
const pemantauanOperasionalRepository = new PemantauanOperasionalRepository();
const identifikasiDanKejadianBahayaRepository = new IdentifikasiDanKejadianBahayaRepository();
const penilaianRisikoRepository = new PenilaianRisikoRepository();
const lokasiSpamRepository = new LokasiSpamRepository();

// Auth
const authService = new AuthService({ authRepository, userRepository });
export const authController = new AuthController({ authService });

// User
export const userService = new UserService({ userRepository });
export const userController = new UserController({ userService });

//lokasi spam
const lokasiSpamService = new LokasiSpamService({ lokasiSpamRepository });
export const lokasiSpamController = new LokasiSpamController({ lokasiSpamService });

//identifikasi bahaya
const identifikasiDanKejadianBahayaService = new IdentifikasiDanKejadianBahayaService({ identifikasiDanKejadianBahayaRepository });
export const identifikasiDanKejadianBahayaController = new IdentifikasiDanKejadianBahayaController({ identifikasiDanKejadianBahayaService });

// Kaji Ulang Risiko
const kajiUlangRisikoService = new KajiUlangRisikoService({ kajiUlangRisikoRepository });
export const kajiUlangRisikoController = new KajiUlangRisikoController({ kajiUlangRisikoService });

//penilaian risiko
const penilaianRisikoService = new PenilaianRisikoService({ penilaianRisikoRepository });
export const penilaianRisikoController = new PenilaianRisikoController({ penilaianRisikoService });

// Rencana Perbaikan
const rencanaPerbaikanService = new RencanaPerbaikanService({ rencanaPerbaikanRepository });
export const rencanaPerbaikanController = new RencanaPerbaikanController({ rencanaPerbaikanService });

// Pemantuan Operasional
const pemantauanOperasionalService = new PemantauanOperasionalService({ kajiUlangRisikoRepository, pemantauanOperasionalRepository });
export const pemantauanOperasionalController = new PemantauanOperasionalController({ pemantauanOperasionalService });
