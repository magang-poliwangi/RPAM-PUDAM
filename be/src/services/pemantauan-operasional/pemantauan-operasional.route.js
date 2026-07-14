import { Router } from 'express';
import authenticateToken from '../../middlewares/authenticate-token.js';



export default function pemantauanOperasionalRoute(pemantauanOperasionalController, {
  validate,
  pemantauanOperasionalPayloadValidatorPost,
  pemantauanOperasionalPayloadValidatorPut,
  pemantauanOperasionalIdParamValidator,
}) {
  const router = Router();
  router.use(authenticateToken);

  router.get('/dropdown/kaji-ulang-risiko', pemantauanOperasionalController.getDropdownKajiUlangRisikoController);

  router.get(
    '/',
    pemantauanOperasionalController.findAllController,
  );

  router.get('/:id', validate(pemantauanOperasionalIdParamValidator, "params"), pemantauanOperasionalController.findByIdController);

  router.post(
    '/',
    validate(pemantauanOperasionalPayloadValidatorPost),
    pemantauanOperasionalController.createController,
  );

  router.put(
    '/:id',
    validate(pemantauanOperasionalIdParamValidator, "params"),
    validate(pemantauanOperasionalPayloadValidatorPut),
    pemantauanOperasionalController.updateController,
  );

  router.delete('/:id', validate(pemantauanOperasionalIdParamValidator, "params"), pemantauanOperasionalController.removeController);

  return router;
}