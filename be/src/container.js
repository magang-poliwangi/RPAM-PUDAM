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

// Repositories
const authRepository = new AuthRepository();
const userRepository = new UserRepository();
const kajiUlangRisikoRepository = new KajiUlangRisikoRepository();
const rencanaPerbaikanRepository = new RencanaPerbaikanRepository();

// Auth
const authService = new AuthService({ authRepository, userRepository });
export const authController = new AuthController({ authService });

// User
export const userService = new UserService({ userRepository });
export const userController = new UserController({ userService });

// Kaji Ulang Risiko
const kajiUlangRisikoService = new KajiUlangRisikoService({ kajiUlangRisikoRepository });
export const kajiUlangRisikoController = new KajiUlangRisikoController({ kajiUlangRisikoService });

// Rencana Perbaikan
const rencanaPerbaikanService = new RencanaPerbaikanService({ rencanaPerbaikanRepository });
export const rencanaPerbaikanController = new RencanaPerbaikanController({ rencanaPerbaikanService });
