import AuthController from "./services/auth/auth.controller.js";
import AuthRepository from "./services/auth/auth.repository.js";
import AuthService from "./services/auth/auth.service.js";
import UserRepository from "./services/user/user.repository.js";
import UserService from "./services/user/user.service.js";
import UserController from "./services/user/user.controller.js";

const authRepository = new AuthRepository();
const userRepository = new UserRepository();



const authService = new AuthService({ authRepository,userRepository });
export const authController = new AuthController({ authService });

export const userService = new UserService({ userRepository });
export const userController = new UserController({ userService });



