import { ActionType } from "./action";

function rencanaPerbaikansReducer(rencanaPerbaikans = [], action = {}) {
    switch (action.type) {
        case ActionType.RECEIVE_RENCANA_PERBAIKANS:
            return action.payload.rencanaPerbaikans;

        case ActionType.ADD_RENCANA_PERBAIKAN:
            return [...rencanaPerbaikans, action.payload.rencanaPerbaikan];

        case ActionType.UPDATE_RENCANA_PERBAIKAN:
            return rencanaPerbaikans.map((item) => (
                item.id === action.payload.rencanaPerbaikan.id
                    ? { ...item, ...action.payload.rencanaPerbaikan }
                    : item
            ));

        case ActionType.DELETE_RENCANA_PERBAIKAN:
            return rencanaPerbaikans.filter((item) => item.id !== action.payload.id);

        default:
            return rencanaPerbaikans;
    }
}

export default rencanaPerbaikansReducer;
