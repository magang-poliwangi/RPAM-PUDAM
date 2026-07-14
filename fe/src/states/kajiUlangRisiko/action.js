import { kajiUlangRisikoApi } from "../../api/kaji-ulang-risiko";
import { getPayload } from "../../utils/response";

export const ActionType = {
    RECEIVE_KAJI_ULANG_RISIKO: "RECEIVE_KAJI_ULANG_RISIKO",
    ADD_KAJI_ULANG_RISIKO: "ADD_KAJI_ULANG_RISIKO",
    UPDATE_KAJI_ULANG_RISIKO: "UPDATE_KAJI_ULANG_RISIKO",
    DELETE_KAJI_ULANG_RISIKO: "DELETE_KAJI_ULANG_RISIKO",
};



export function receiveKajiUlangRisikosActionCreator({ items, pagination }) {
    return {
        type: ActionType.RECEIVE_KAJI_ULANG_RISIKO,
        payload: { items, pagination },
    };
}

export function addKajiUlangRisikoActionCreator(kajiUlangRisiko) {
    return {
        type: ActionType.ADD_KAJI_ULANG_RISIKO,
        payload: { kajiUlangRisiko },
    };
}

export function updateKajiUlangRisikoActionCreator(kajiUlangRisiko) {
    return {
        type: ActionType.UPDATE_KAJI_ULANG_RISIKO,
        payload: { kajiUlangRisiko },
    };
}

export function deleteKajiUlangRisikoActionCreator(id) {
    return {
        type: ActionType.DELETE_KAJI_ULANG_RISIKO,
        payload: { id },
    };
}


export function asyncReceiveKajiUlangRisiko(params = {}) {
    return async (dispatch) => {
        const result = getPayload(await kajiUlangRisikoApi.getAll(params));

        dispatch(receiveKajiUlangRisikosActionCreator({
            items: result.items || [],
            pagination: result.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
        }));

        return result;
    };
}

export function asyncAddKajiUlangRisiko(payload) {
    return async (dispatch) => {
        const kajiUlangRisiko = getPayload(await kajiUlangRisikoApi.create(payload));
        dispatch(addKajiUlangRisikoActionCreator(kajiUlangRisiko));
        return kajiUlangRisiko;
    };
}

export function asyncUpdateKajiUlangRisiko({ id, payload }) {
    return async (dispatch) => {
        const kajiUlangRisiko = getPayload(await kajiUlangRisikoApi.update(id, payload));
        dispatch(updateKajiUlangRisikoActionCreator(kajiUlangRisiko));
        return kajiUlangRisiko;
    };
}

export function asyncDeleteKajiUlangRisiko(id) {
    return async (dispatch) => {
        await kajiUlangRisikoApi.remove(id);
        dispatch(deleteKajiUlangRisikoActionCreator(id));
    };
}
