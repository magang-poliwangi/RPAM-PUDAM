import express from 'express';
import authenticateToken from '../../middlewares/authenticate-token.js';
import isActive from '../../middlewares/is-active.js';

export default function kajiUlangRisikoRoute(
    kajiUlangRisikoController,
    {
        validate,
        kajiUlangRisikoPayloadValidatorPost,
        kajiUlangRisikoPayloadValidatorPut,
        kajiUlangRisikoIdParamValidator,
    }
) {
    const router = express.Router();

    router.use(authenticateToken);
    router.use(isActive);

    router.post('/', validate(kajiUlangRisikoPayloadValidatorPost), kajiUlangRisikoController.createController);
    router.get('/', kajiUlangRisikoController.findAllController);
    router.get('/:id', validate(kajiUlangRisikoIdParamValidator, 'params'), kajiUlangRisikoController.findByIdController);
    router.put('/:id', validate(kajiUlangRisikoIdParamValidator, 'params'), validate(kajiUlangRisikoPayloadValidatorPut), kajiUlangRisikoController.updateController);
    router.delete('/:id', validate(kajiUlangRisikoIdParamValidator, 'params'), kajiUlangRisikoController.removeController);

    return router;
}
