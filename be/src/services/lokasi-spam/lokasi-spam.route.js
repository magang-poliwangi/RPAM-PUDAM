import { Router } from 'express';
import authenticateToken from '../../middlewares/authenticate-token.js';

export default function lokasiSpamRoute(lokasiSpamController, {
  validate,
  lokasiSpamPayloadValidatorPost,
  lokasiSpamPayloadValidatorPut,
  lokasiSpamIdParamValidator,
}) {
  const router = Router();

  router.use(authenticateToken);

  router.get(
    '/',
    lokasiSpamController.findAllController,
  );

  router.get(
    "/options",
    lokasiSpamController.getFilterOptionsController
  );

  router.get('/:id', validate(lokasiSpamIdParamValidator, "params"), lokasiSpamController.findByIdController);

  router.post(
    '/',
    validate(lokasiSpamPayloadValidatorPost),
    lokasiSpamController.createController,
  );

  router.put(
    '/:id',
    validate(lokasiSpamIdParamValidator, "params"),
    validate(lokasiSpamPayloadValidatorPut),
    lokasiSpamController.updateController,
  );

  router.delete('/:id', validate(lokasiSpamIdParamValidator, "params"), lokasiSpamController.removeController);

  return router;
}