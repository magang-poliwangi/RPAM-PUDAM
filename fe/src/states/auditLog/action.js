import { auditLogApi } from '../../api/audit-log';
import { getPayload } from '../../utils/response';

export const ActionType = {
    RECEIVE_AUDIT_LOG: 'RECEIVE_AUDIT_LOG',
};

export function receiveAuditLogActionCreator({ items, pagination }) {
    return {
        type: ActionType.RECEIVE_AUDIT_LOG,
        payload: { items, pagination },
    };
}

export function asyncReceiveAuditLog(params = {}) {
    return async (dispatch) => {
        const result = getPayload(await auditLogApi.getAll(params));

        dispatch(receiveAuditLogActionCreator({
            items: result.items || [],
            pagination: result.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 },
        }));

        return result;
    };
}