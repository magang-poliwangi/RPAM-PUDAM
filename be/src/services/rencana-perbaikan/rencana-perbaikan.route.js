import express from 'express';
import authenticateToken from '../../middlewares/authenticate-token.js';

export default function rencanaPerbaikanRoute(
    rencanaPerbaikanController,
    {
        validate,
        rencanaPerbaikanPayloadValidatorPost,
        rencanaPerbaikanPayloadValidatorPut,
        rencanaPerbaikanIdParamValidator,
    }
) {
    const router = express.Router();

    router.use(authenticateToken);

    router.post('/', validate(rencanaPerbaikanPayloadValidatorPost), rencanaPerbaikanController.createController);
    router.get('/', rencanaPerbaikanController.findAllController);
    router.get('/:id', validate(rencanaPerbaikanIdParamValidator, 'params'), rencanaPerbaikanController.findByIdController);
    router.put('/:id', validate(rencanaPerbaikanIdParamValidator, 'params'), validate(rencanaPerbaikanPayloadValidatorPut), rencanaPerbaikanController.updateController);
    router.delete('/:id', validate(rencanaPerbaikanIdParamValidator, 'params'), rencanaPerbaikanController.removeController);

    return router;
}
