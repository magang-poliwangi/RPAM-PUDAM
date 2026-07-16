import { Router } from 'express';
import authenticateToken from '../../middlewares/authenticate-token.js';
import isAdmin from '../../middlewares/is-admin.js';

export default function auditLogRoute(auditLogController) {
    const router = Router();

    router.use(authenticateToken);
    router.use(isAdmin); 

    router.get('/', auditLogController.findAllController);

    return router;
}