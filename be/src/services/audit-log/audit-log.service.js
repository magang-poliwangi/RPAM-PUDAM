import { getPaginationQuery } from '../../utils/pagination.js';

export default class AuditLogService {
    constructor({ auditLogRepository }) {
        this.auditLogRepository = auditLogRepository;
    }

    async findAll({ req }) {
        const { page, limit, skip, sortBy, sortOrder } = getPaginationQuery(req);
        const { search, aksi, namaTabel, userId, startDate, endDate } = req.query;

        const where = {
            ...(aksi && { aksi }),
            ...(namaTabel && { namaTabel }),
            ...(userId && { userId }),
            ...(search && {
                keterangan: { contains: search, mode: 'insensitive' },
            }),
            ...((startDate || endDate) && {
                createdAt: {
                    ...(startDate && { gte: new Date(startDate) }),
                    ...(endDate && { lte: new Date(endDate) }),
                },
            }),
        };

        const [data, total] = await Promise.all([
            this.auditLogRepository.findAll({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.auditLogRepository.count({ where }),
        ]);

        return {
            items: data,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
}