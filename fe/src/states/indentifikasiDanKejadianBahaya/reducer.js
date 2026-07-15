import { ActionType } from "./action";
const initialState = {
    items: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
};

function identifikasiDanKejadianBahayaReducer(state = initialState, action = {}) {
    switch (action.type) {
        case ActionType.RECEIVE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA:
            return {
                ...state,
                items: action.payload.items,
                pagination: action.payload.pagination,
            };

        case ActionType.ADD_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA:
            return {
                ...state,
                items: [action.payload.identifikasiDanKejadianBahaya, ...state.items],
                pagination: { ...state.pagination, total: state.pagination.total + 1 },
            };

        case ActionType.UPDATE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA:
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.identifikasiDanKejadianBahaya.id
                        ? { ...item, ...action.payload.identifikasiDanKejadianBahaya }
                        : item
                ),
            };

        case ActionType.DELETE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA:
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload.id),
                pagination: { ...state.pagination, total: Math.max(0, state.pagination.total - 1) },
            };

        default:
            return state;
    }
}

export default identifikasiDanKejadianBahayaReducer;