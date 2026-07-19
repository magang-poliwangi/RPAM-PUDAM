import { Router } from 'express';
import authenticateToken from '../../middlewares/authenticate-token.js';

export default function bahayaKontaminasiRoute(bahayaKontaminasi, {
    validate,
    bahayaKontaminasiPayloadValidatorPost,
    bahayaKontaminasiPayloadValidatorPut,
    bahayaKontaminasiIdParamValidator,
}) {
    const router = Router();

    router.use(authenticateToken);

    router.get(
        '/',
        bahayaKontaminasi.findAllController,
    );

    router.get('/:id', validate(bahayaKontaminasiIdParamValidator, "params"), bahayaKontaminasi.findByIdController);

    router.post(
        '/',
        validate(bahayaKontaminasiPayloadValidatorPost),
        bahayaKontaminasi.createController,
    );

    router.put(
        '/:id',
        validate(bahayaKontaminasiIdParamValidator, "params"),
        validate(bahayaKontaminasiPayloadValidatorPut),
        bahayaKontaminasi.updateController,
    );

    router.delete('/:id', validate(bahayaKontaminasiIdParamValidator, "params"), bahayaKontaminasi.removeController);

    return router;
}