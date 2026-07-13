import { kajiUlangRisikoApi } from "../../api/kaji-ulang-risiko";

export const ActionType = {
    RECEIVE_KAJI_ULANG_RISIKOS: "RECEIVE_KAJI_ULANG_RISIKOS",
    ADD_KAJI_ULANG_RISIKO: "ADD_KAJI_ULANG_RISIKO",
    UPDATE_KAJI_ULANG_RISIKO: "UPDATE_KAJI_ULANG_RISIKO",
    DELETE_KAJI_ULANG_RISIKO: "DELETE_KAJI_ULANG_RISIKO",
};

const getPayload = (response) => response?.data?.data ?? response?.data ?? response;

export function receiveKajiUlangRisikosActionCreator(kajiUlangRisikos) {
    return {
        type: ActionType.RECEIVE_KAJI_ULANG_RISIKOS,
        payload: { kajiUlangRisikos },
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

export function asyncReceiveKajiUlangRisikos(params = {}) {
    return async (dispatch) => {
        const result = getPayload(await kajiUlangRisikoApi.getAll(params));
        dispatch(receiveKajiUlangRisikosActionCreator(result.items || []));
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
