import express from 'express';

import { authController, userController, kajiUlangRisikoController, rencanaPerbaikanController } from './container.js';

import authRoute from './services/auth/auth.route.js';
import userRoute from './services/user/user.route.js';
import kajiUlangRisikoRoute from './services/kaji-ulang-risiko/kaji-ulang-risiko.route.js';
import rencanaPerbaikanRoute from './services/rencana-perbaikan/rencana-perbaikan.route.js';

import { authenticationPayloadValidatorPost } from './services/auth/auth.validator.js';
import { userPayloadValidatorPost, userPayloadValidatorPut, userIdParamValidator } from './services/user/user.validator.js';
import {
    kajiUlangRisikoPayloadValidatorPost,
    kajiUlangRisikoPayloadValidatorPut,
    kajiUlangRisikoIdParamValidator,
} from './services/kaji-ulang-risiko/kaji-ulang-risiko.validator.js';
import {
    rencanaPerbaikanPayloadValidatorPost,
    rencanaPerbaikanPayloadValidatorPut,
    rencanaPerbaikanIdParamValidator,
} from './services/rencana-perbaikan/rencana-perbaikan.validator.js';

import { loginLimiter } from './middlewares/rate-limiter.js';
import validate from './middlewares/validate.js';

const routers = express.Router();

routers.use(
    '/auth',
    authRoute(authController, {
        authenticationPayloadValidatorPost,
        validate,
        loginLimiter,
    })
);

routers.use(
    '/user',
    userRoute(userController, {
        validate,
        userPayloadValidatorPost,
        userIdParamValidator,
        userPayloadValidatorPut,
    })
);

routers.use(
    '/kaji-ulang-risiko',
    kajiUlangRisikoRoute(kajiUlangRisikoController, {
        validate,
        kajiUlangRisikoPayloadValidatorPost,
        kajiUlangRisikoPayloadValidatorPut,
        kajiUlangRisikoIdParamValidator,
    })
);

routers.use(
    '/rencana-perbaikan',
    rencanaPerbaikanRoute(rencanaPerbaikanController, {
        validate,
        rencanaPerbaikanPayloadValidatorPost,
        rencanaPerbaikanPayloadValidatorPut,
        rencanaPerbaikanIdParamValidator,
    })
);

export default routers;
