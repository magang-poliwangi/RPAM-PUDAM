import { ActionType } from "./action";
const initialState = {
    items: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
};

function lokasiSpamReducer(state = initialState, action = {}) {
    switch (action.type) {
        case ActionType.RECEIVE_LOKASI_SPAM:
            return {
                ...state,
                items: action.payload.items,
                pagination: action.payload.pagination,
            };

        case ActionType.ADD_LOKASI_SPAM:
            return {
                ...state,
                items: [action.payload.lokasiSpam , ...state.items],
                pagination: { ...state.pagination, total: state.pagination.total + 1 },
            };

        case ActionType.UPDATE_LOKASI_SPAM:
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.lokasiSpam .id
                        ? { ...item, ...action.payload.lokasiSpam  }
                        : item
                ),
            };

        case ActionType.DELETE_LOKASI_SPAM:
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload.id),
                pagination: { ...state.pagination, total: Math.max(0, state.pagination.total - 1) },
            };

        default:
            return state;
    }
}

export default lokasiSpamReducer;
