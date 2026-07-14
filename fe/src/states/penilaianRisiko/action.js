import { penilaianRisikoApi } from "../../api/penilaian-risiko";
import { getPayload } from "../../utils/response";

export const ActionType = {
    RECEIVE_PENILAIAN_RISIKO: "RECEIVE_PENILAIAN_RISIKO",
    ADD_PENILAIAN_RISIKO: "ADD_PENILAIAN_RISIKO",
    UPDATE_PENILAIAN_RISIKO: "UPDATE_PENILAIAN_RISIKO",
    DELETE_PENILAIAN_RISIKO: "DELETE_PENILAIAN_RISIKO",
};

export function receivePenilaianRisikoActionCreator({ items, pagination }) {
    return {
        type: ActionType.RECEIVE_PENILAIAN_RISIKO,
        payload: { items, pagination },
    };
}

export function addPenilaianRisikoActionCreator(penilaianrisiko) {
    return {
        type: ActionType.ADD_PENILAIAN_RISIKO,
        payload: { penilaianrisiko },
    };
}
export function updatePenilaianRisikoActionCreator(penilaianrisiko) {
    return {
        type: ActionType.UPDATE_PENILAIAN_RISIKO,
        payload: { penilaianrisiko },
    };
}


export function deletePenilaianRisikoActionCreator(id) {
    return {
        type: ActionType.DELETE_PENILAIAN_RISIKO,
        payload: { id },
    };
}
export function asyncReceivePenilaianRisiko(params = {}) {
    return async (dispatch) => {
        const result = getPayload(await penilaianRisikoApi.getAll(params));
        dispatch(receivePenilaianRisikoActionCreator({
            items: result.items || [],
            pagination: result.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
        }));
        return result;
    };
}

export function asyncAddPenilaianRisiko(payload) {
    return async (dispatch) => {
        const PenilaianRisiko = getPayload(await penilaianRisikoApi.create(payload));
        dispatch(addPenilaianRisikoActionCreator(PenilaianRisiko));
        return PenilaianRisiko;
    };
}

export function asyncUpdatePenilaianRisiko({ id, payload }) {
    return async (dispatch) => {
        const PenilaianRisiko = getPayload(await penilaianRisikoApi.update(id, payload));
        dispatch(updatePenilaianRisikoActionCreator(PenilaianRisiko));
        return PenilaianRisiko;
    };
}

export function asyncDeletePenilaianRisiko(id) {
    return async (dispatch) => {
        await penilaianRisikoApi.remove(id);
        dispatch(deletePenilaianRisikoActionCreator(id));
    };
}