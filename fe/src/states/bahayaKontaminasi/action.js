import { bahayakontaminasiApi } from "../../api/bahaya-kontaminasi";
import { getPayload } from "../../utils/response";

export const ActionType = {
    RECEIVE_BAHAYA_KONTAMINASI: "RECEIVE_BAHAYA_KONTAMINASI",
    ADD_BAHAYA_KONTAMINASI: "ADD_BAHAYA_KONTAMINASI",
    UPDATE_BAHAYA_KONTAMINASI: "UPDATE_BAHAYA_KONTAMINASI",
    DELETE_BAHAYA_KONTAMINASI: "DELETE_BAHAYA_KONTAMINASI",
};

export function receiveBahayaKontaminasiActionCreator({ items, pagination }) {
    return {
        type: ActionType.RECEIVE_BAHAYA_KONTAMINASI,
        payload: { items, pagination },
    };
}

export function addBahayaKontaminasiActionCreator(bahayaKontaminasi) {
    return {
        type: ActionType.ADD_BAHAYA_KONTAMINASI,
        payload: { bahayaKontaminasi },
    };
}
export function updateBahayaKontaminasiActionCreator(bahayaKontaminasi) {
    return {
        type: ActionType.UPDATE_BAHAYA_KONTAMINASI,
        payload: {bahayaKontaminasi },
    };
}


export function deleteBahayaKontaminasiActionCreator(id) {
    return {
        type: ActionType.DELETE_BAHAYA_KONTAMINASI,
        payload: { id },
    };
}

export function asyncReceiveBahayaKontaminasi(params = {}) {
    return async (dispatch) => {
        const result = getPayload(await bahayakontaminasiApi.getAll(params));
        dispatch(receiveBahayaKontaminasiActionCreator({
            items: result.items || [],
            pagination: result.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
        }));
        return result;
    };
}

export function asyncAddBahayaKontaminasi(payload) {
    return async (dispatch) => {
        const bahayaKontaminasi = getPayload(await bahayakontaminasiApi.create(payload));
        
        dispatch(addBahayaKontaminasiActionCreator(bahayaKontaminasi));
    
        return bahayaKontaminasi;
    };
}

export function asyncUpdateBahayaKontaminasi({ id, payload }) {
    return async (dispatch) => {
        const bahayaKontaminasi = getPayload(await bahayakontaminasiApi.update(id, payload));
        dispatch(updateBahayaKontaminasiActionCreator(bahayaKontaminasi));
        return bahayaKontaminasi;
    };
}

export function asyncDeleteBahayaKontaminasi(id) {
    return async (dispatch) => {
        await bahayakontaminasiApi.remove(id);
        dispatch(deleteBahayaKontaminasiActionCreator(id));
    };
}