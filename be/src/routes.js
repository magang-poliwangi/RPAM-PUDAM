import express from 'express';

import { authController, userController, kajiUlangRisikoController, rencanaPerbaikanController, pemantauanOperasionalController, penilaianRisikoController, identifikasiDanKejadianBahayaController, lokasiSpamController, auditLogController, bahayaKontaminasiController, excelController } from './container.js';

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
    lokasiSpamPayloadValidatorPost,
    lokasiSpamPayloadValidatorPut,
    lokasiSpamIdParamValidator
} from './services/lokasi-spam/lokasi-spam.validator.js';
import {
    rencanaPerbaikanPayloadValidatorPost,
    rencanaPerbaikanPayloadValidatorPut,
    rencanaPerbaikanIdParamValidator,
} from './services/rencana-perbaikan/rencana-perbaikan.validator.js';

import {
    pemantauanOperasionalIdParamValidator,
    pemantauanOperasionalPayloadValidatorPost,
    pemantauanOperasionalPayloadValidatorPut,
} from './services/pemantauan-operasional/pemantauan-operasional.validator.js';

import {
    identifikasiBahayaIdParamValidator,
    identifikasiBahayaPayloadValidatorPost,
    identifikasiBahayaPayloadValidatorPut
} from './services/identifikasi-dan-kejadian-bahaya/identifikasi-dan-kejadian-bahaya.validator.js';

import {
    penilaianRisikoIdParamValidator,
    penilaianRisikoPayloadValidatorPost,
    penilaianRisikoPayloadValidatorPut
} from './services/penilaian-risiko/penilaian-risiko.validator.js';

import { loginLimiter } from './middlewares/rate-limiter.js';
import validate from './middlewares/validate.js';
import pemantauanOperasionalRoute from './services/pemantauan-operasional/pemantauan-operasional.route.js';
import penilaianRisikoRoute from './services/penilaian-risiko/penilaian-risiko.route.js';
import identifikasiDanKejadianBahayaRoute from './services/identifikasi-dan-kejadian-bahaya/identifikasi-dan-kejadian-bahaya.route.js';
import lokasiSpamRoute from './services/lokasi-spam/lokasi-spam.route.js';
import auditLogRoute from './services/audit-log/audit-log.route.js';
import bahayaKontaminasiRoute from './services/bahaya-kontaminasi/bahaya-kontaminasi.route.js';
import {
    bahayaKontaminasiIdParamValidator,
    bahayaKontaminasiPayloadValidatorPost,
    bahayaKontaminasiPayloadValidatorPut
} from './services/bahaya-kontaminasi/bahaya-kontaminasi.validator.js';
import excelRoute from './services/excel/excel.route.js';

const routers = express.Router();

//auth
routers.use(
    '/auth',
    authRoute(authController, {
        authenticationPayloadValidatorPost,
        validate,
        loginLimiter,
    })
);

//user
routers.use(
    '/user',
    userRoute(userController, {
        validate,
        userPayloadValidatorPost,
        userIdParamValidator,
        userPayloadValidatorPut,
    })
);


// bahay kontaminasi
routers.use(
    '/bahaya-kontaminasi',
    bahayaKontaminasiRoute(bahayaKontaminasiController, {
        validate,
        bahayaKontaminasiPayloadValidatorPost,
        bahayaKontaminasiPayloadValidatorPut,
        bahayaKontaminasiIdParamValidator,
    })
);
// lokasi spam
routers.use(
    '/lokasi-spam',
    lokasiSpamRoute(lokasiSpamController, {
        validate,
        lokasiSpamPayloadValidatorPost,
        lokasiSpamPayloadValidatorPut,
        lokasiSpamIdParamValidator,
    })
);

// kaji ulang risik
routers.use(
    '/kaji-ulang-risiko',
    kajiUlangRisikoRoute(kajiUlangRisikoController, {
        validate,
        kajiUlangRisikoPayloadValidatorPost,
        kajiUlangRisikoPayloadValidatorPut,
        kajiUlangRisikoIdParamValidator,
    })
);

//rencana perbaikan
routers.use(
    '/rencana-perbaikan',
    rencanaPerbaikanRoute(rencanaPerbaikanController, {
        validate,
        rencanaPerbaikanPayloadValidatorPost,
        rencanaPerbaikanPayloadValidatorPut,
        rencanaPerbaikanIdParamValidator,
    })
);

//pemantuan operasional
routers.use(
    '/pemantauan-operasional',
    pemantauanOperasionalRoute(pemantauanOperasionalController, {
        validate,
        pemantauanOperasionalIdParamValidator,
        pemantauanOperasionalPayloadValidatorPost,
        pemantauanOperasionalPayloadValidatorPut,
    })
);

//identifikasi bahaya
routers.use(
    '/identifikasi-dan-kejadian-bahaya',
    identifikasiDanKejadianBahayaRoute(identifikasiDanKejadianBahayaController, {
        validate,
        identifikasiBahayaIdParamValidator,
        identifikasiBahayaPayloadValidatorPost,
        identifikasiBahayaPayloadValidatorPut
    })
);

//penilainan risiko
routers.use(
    '/penilaian-risiko',
    penilaianRisikoRoute(penilaianRisikoController, {
        validate,
        penilaianRisikoIdParamValidator,
        penilaianRisikoPayloadValidatorPost,
        penilaianRisikoPayloadValidatorPut
    })
);


//log
routers.use(
    '/audit-log',
    auditLogRoute(auditLogController)
);

//excel
routers.use(
    '/excel',
    excelRoute(excelController)
);

export default routers;
