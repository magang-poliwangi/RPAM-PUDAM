import rencanaPerbaikanApi from "../../api/rencana-perbaikan";
import { getPayload } from "../../utils/response";

export const ActionType = {
    RECEIVE_RENCANA_PERBAIKAN: "RECEIVE_RENCANA_PERBAIKAN",
    ADD_RENCANA_PERBAIKAN: "ADD_RENCANA_PERBAIKAN",
    UPDATE_RENCANA_PERBAIKAN: "UPDATE_RENCANA_PERBAIKAN",
    DELETE_RENCANA_PERBAIKAN: "DELETE_RENCANA_PERBAIKAN",
};


export function receiveRencanaPerbaikansActionCreator({ items, pagination }) {
    return {
        type: ActionType.RECEIVE_RENCANA_PERBAIKAN,
        payload: { items, pagination },
    };
}

export function addRencanaPerbaikanActionCreator(rencanaPerbaikan) {
    return {
        type: ActionType.ADD_RENCANA_PERBAIKAN,
        payload: { rencanaPerbaikan },
    };
}

export function updateRencanaPerbaikanActionCreator(rencanaPerbaikan) {
    return {
        type: ActionType.UPDATE_RENCANA_PERBAIKAN,
        payload: { rencanaPerbaikan },
    };
}

export function deleteRencanaPerbaikanActionCreator(id) {
    return {
        type: ActionType.DELETE_RENCANA_PERBAIKAN,
        payload: { id },
    };
}

export function asyncReceiveRencanaPerbaikan(params = {}) {
    return async (dispatch) => {
        const result = getPayload(await rencanaPerbaikanApi.getAll(params));
        dispatch(receiveRencanaPerbaikansActionCreator({
            items: result.items || [],
            pagination: result.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
        }));
        return result;
    };
}

export function asyncAddRencanaPerbaikan(payload) {
    return async (dispatch) => {
        const rencanaPerbaikan = getPayload(await rencanaPerbaikanApi.create(payload));
        dispatch(addRencanaPerbaikanActionCreator(rencanaPerbaikan));
        return rencanaPerbaikan;
    };
}

export function asyncUpdateRencanaPerbaikan({ id, payload }) {
    return async (dispatch) => {
        const rencanaPerbaikan = getPayload(await rencanaPerbaikanApi.update(id, payload));
        dispatch(updateRencanaPerbaikanActionCreator(rencanaPerbaikan));
        return rencanaPerbaikan;
    };
}

export function asyncDeleteRencanaPerbaikan(id) {
    return async (dispatch) => {
        await rencanaPerbaikanApi.remove(id);
        dispatch(deleteRencanaPerbaikanActionCreator(id));
    };
}
