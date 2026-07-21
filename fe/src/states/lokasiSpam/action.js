import { lokasiSpamApi } from "../../api/lokasi-spam";
import { getPayload } from "../../utils/response";

export const ActionType = {
    RECEIVE_LOKASI_SPAM: "RECEIVE_LOKASI_SPAM",
    ADD_LOKASI_SPAM: "ADD_LOKASI_SPAM",
    UPDATE_LOKASI_SPAM: "UPDATE_LOKASI_SPAM",
    DELETE_LOKASI_SPAM: "DELETE_LOKASI_SPAM",
};

export function receiveLokasiSpamActionCreator({ items, pagination }) {
    return {
        type: ActionType.RECEIVE_LOKASI_SPAM,
        payload: { items, pagination },
    };
}

export function addLokasiSpamActionCreator(lokasiSpam) {
    return {
        type: ActionType.ADD_LOKASI_SPAM,
        payload: { lokasiSpam },
    };
}
export function updateLokasiSpamActionCreator(lokasiSpam) {
    return {
        type: ActionType.UPDATE_LOKASI_SPAM,
        payload: { lokasiSpam },
    };
}


export function deleteLokasiSpamActionCreator(id) {
    return {
        type: ActionType.DELETE_LOKASI_SPAM,
        payload: { id },
    };
}

export function asyncReceiveLokasiSpam(params = {}) {
    return async (dispatch) => {
        const result = getPayload(await lokasiSpamApi.getAll(params));
        dispatch(receiveLokasiSpamActionCreator({
            items: result.items || [],
            pagination: result.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
        }));
        return result;
    };
}

export function asyncAddLokasiSpam(payload) {
    return async (dispatch) => {
        const lokasiSpam = getPayload(await lokasiSpamApi.create(payload));
        
        dispatch(addLokasiSpamActionCreator(lokasiSpam));

        return lokasiSpam;
    };
}

export function asyncUpdateLokasiSpam({ id, payload }) {
    return async (dispatch) => {
        const result = getPayload(await lokasiSpamApi.update(id, payload));
        dispatch(updateLokasiSpamActionCreator(result));
        return result;
    };
}

export function asyncDeleteLokasiSpam(id) {
    return async (dispatch) => {
        await lokasiSpamApi.remove(id);
        dispatch(deleteLokasiSpamActionCreator(id));
    };
}

export const asyncGetLokasiSpamOptions = () => async () => {
    const result = await lokasiSpamApi.getOptions();

    return getPayload(result);
};