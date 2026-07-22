import { Router } from 'express';
import authenticateToken from '../../middlewares/authenticate-token.js';
import isAdmin from '../../middlewares/is-admin.js';
import isActive from '../../middlewares/is-active.js';

export default function auditLogRoute(auditLogController) {
    const router = Router();

    router.use(authenticateToken);
    router.use(isAdmin); 
    router.use(isActive); 

    router.get('/', auditLogController.findAllController);

    return router;
}