import { ActionType } from './action';

const initialState = {
    items: [],
    pagination: { total: 0, page: 1, limit: 20, totalPages: 1 },
};

function auditLogReducer(state = initialState, action = {}) {
    switch (action.type) {
        case ActionType.RECEIVE_AUDIT_LOG:
            return { ...state, items: action.payload.items, pagination: action.payload.pagination };
        default:
            return state;
    }
}

export default auditLogReducer;