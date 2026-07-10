import express from 'express';
import { authController, userController } from './container.js';
import userRoute from './services/user/user.route.js';
import authRoute from './services/auth/auth.route.js';
import { authenticationPayloadValidatorPost } from "./services/auth/auth.validator.js";
import { userPayloadValidatorPost, userPayloadValidatorPut, userIdParamValidator } from "./services/user/user.validator.js";
import { loginLimiter } from "./middlewares/rate-limiter.js";
import validate from "./middlewares/validate.js";

const routers = express.Router();
routers.use(
    "/auth",
    authRoute(authController, {
        authenticationPayloadValidatorPost,
        validate,
        loginLimiter,
    })
);

routers.use(
    "/user",
    userRoute(userController, { validate, userPayloadValidatorPost, userIdParamValidator, userPayloadValidatorPut })
);
export default routers;