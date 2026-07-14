import { identifikasiDanKejadianBahayaApi } from "../../api/identifikasi-dan-kejadian-bahaya";
import { getPayload } from "../../utils/response";

export const ActionType = {
    RECEIVE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA: "RECEIVE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA",
    ADD_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA: "ADD_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA",
    UPDATE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA: "UPDATE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA",
    DELETE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA: "DELETE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA",
};

export function receiveIdentifikasiDanKejadianBahayaActionCreator({ items, pagination }) {
    return {
        type: ActionType.RECEIVE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA,
        payload: { items, pagination },
    };
}

export function addIdentifikasiDanKejadianBahayaActionCreator(identifikasiDanKejadianBahaya) {
    return {
        type: ActionType.ADD_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA,
        payload: { identifikasiDanKejadianBahaya },
    };
}
export function updateIdentifikasiDanKejadianBahayaActionCreator(identifikasiDanKejadianBahaya) {
    return {
        type: ActionType.UPDATE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA,
        payload: { identifikasiDanKejadianBahaya },
    };
}


export function deleteIdentifikasiDanKejadianBahayaActionCreator(id) {
    return {
        type: ActionType.DELETE_IDENTIFIKASI_DAN_KEJADIAN_BAHAYA,
        payload: { id },
    };
}
export function asyncReceiveIdentifikasiDanKejadianBahaya(params = {}) {
    return async (dispatch) => {
        const result = getPayload(await identifikasiDanKejadianBahayaApi.getAll(params));

        dispatch(receiveIdentifikasiDanKejadianBahayaActionCreator({
            items: result.items || [],
            pagination: result.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
        }));
        return result;
    };
}

export function asyncAddIdentifikasiDanKejadianBahaya(payload) {
    return async (dispatch) => {
        const pemantauanOperasional = getPayload(await identifikasiDanKejadianBahayaApi.create(payload));
        dispatch(addIdentifikasiDanKejadianBahayaActionCreator(pemantauanOperasional));
        return pemantauanOperasional;
    };
}

export function asyncUpdateIdentifikasiDanKejadianBahaya({ id, payload }) {
    return async (dispatch) => {
        const pemantauanOperasional = getPayload(await identifikasiDanKejadianBahayaApi.update(id, payload));
        dispatch(updateIdentifikasiDanKejadianBahayaActionCreator(pemantauanOperasional));
        return pemantauanOperasional;
    };
}

export function asyncDeleteIdentifikasiDanKejadianBahaya(id) {
    return async (dispatch) => {
        await identifikasiDanKejadianBahayaApi.remove(id);
        dispatch(deleteIdentifikasiDanKejadianBahayaActionCreator(id));
    };
}