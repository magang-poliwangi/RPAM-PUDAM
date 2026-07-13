import { ActionType } from './action';

function errorReducer(error = null, action = {}) {
    switch (action.type) {
        case ActionType.SET_ERROR:
            return action.payload.error;
        case ActionType.UNSET_ERROR:
            return null;
        default:
            return error;
    }
}


export default errorReducer;