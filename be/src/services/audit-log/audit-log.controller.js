/* eslint-disable no-unused-vars */
import response from '../../utils/response.js';

export default class AuditLogController {
    constructor({ auditLogService }) {
        this.auditLogService = auditLogService;
    }

    findAllController = async (req, res, next) => {
        const result = await this.auditLogService.findAll({ req });
        return response(res, 200, 'Data audit log berhasil diambil', result);
    };
}