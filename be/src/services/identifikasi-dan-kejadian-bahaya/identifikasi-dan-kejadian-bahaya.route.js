import express from 'express';
import authenticateToken from '../../middlewares/authenticate-token.js';
import isActive from '../../middlewares/is-active.js';

export default function identifikasiDanKejadianBahayaRoute(
    identifikasiBahayaController,
    {
        validate,
        identifikasiBahayaPayloadValidatorPost,
        identifikasiBahayaPayloadValidatorPut,
        identifikasiBahayaIdParamValidator,
    }
) {
    const router = express.Router();

    router.use(authenticateToken);
    router.use(isActive);

    router.post('/', validate(identifikasiBahayaPayloadValidatorPost), identifikasiBahayaController.createController);
    router.get('/', identifikasiBahayaController.findAllController);
    router.get('/:id', validate(identifikasiBahayaIdParamValidator, 'params'), identifikasiBahayaController.findByIdController);
    router.put('/:id', validate(identifikasiBahayaIdParamValidator, 'params'), validate(identifikasiBahayaPayloadValidatorPut), identifikasiBahayaController.updateController);
    router.delete('/:id', validate(identifikasiBahayaIdParamValidator, 'params'), identifikasiBahayaController.removeController);

    return router;
}