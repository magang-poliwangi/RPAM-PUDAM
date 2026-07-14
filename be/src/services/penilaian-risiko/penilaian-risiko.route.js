import { Router } from 'express';
import authenticateToken from '../../middlewares/authenticate-token.js';

export default function penilaianRisikoRoute(penilaianRisikoController, {
    validate,
    penilaianRisikoPayloadValidatorPost,
    penilaianRisikoPayloadValidatorPut,
    penilaianRisikoIdParamValidator,
}) {
    const router = Router();

    router.use(authenticateToken);

    router.get('/', penilaianRisikoController.findAllController);
    router.get('/:id', validate(penilaianRisikoIdParamValidator, "params"), penilaianRisikoController.findByIdController);
    router.post('/', validate(penilaianRisikoPayloadValidatorPost), penilaianRisikoController.createController);
    router.put(
        '/:id',
        validate(penilaianRisikoIdParamValidator, "params"),
        validate(penilaianRisikoPayloadValidatorPut),
        penilaianRisikoController.updateController,
    );
    router.delete('/:id', validate(penilaianRisikoIdParamValidator, "params"), penilaianRisikoController.removeController);

    return router;
}