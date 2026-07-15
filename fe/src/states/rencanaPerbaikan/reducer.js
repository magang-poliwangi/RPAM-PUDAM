import { ActionType } from "./action";
const initialState = {
    items: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
};

function rencanaPerbaikanReducer(state = initialState, action = {}) {
     switch (action.type) {
        case ActionType.RECEIVE_RENCANA_PERBAIKAN:
            return {
                ...state,
                items: action.payload.items,
                pagination: action.payload.pagination,
            };

        case ActionType.ADD_RENCANA_PERBAIKAN:
            return {
                ...state,
                items: [action.payload.rencanaPerbaikan, ...state.items],
                pagination: { ...state.pagination, total: state.pagination.total + 1 },
            };

        case ActionType.UPDATE_RENCANA_PERBAIKAN:
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.rencanaPerbaikan.id
                        ? { ...item, ...action.payload.rencanaPerbaikan }
                        : item
                ),
            };

        case ActionType.DELETE_RENCANA_PERBAIKAN:
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload.id),
                pagination: { ...state.pagination, total: Math.max(0, state.pagination.total - 1) },
            };

        default:
            return state;
    }

}

export default rencanaPerbaikanReducer;
