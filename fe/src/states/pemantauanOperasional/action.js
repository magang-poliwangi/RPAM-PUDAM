import { pemantauanOperasionalApi } from "../../api/pemantauan-operasional";
import { getPayload } from "../../utils/response";

export const ActionType = {
    RECEIVE_PEMANTAUAN_OPERASIONAL: "RECEIVE_PEMANTAUAN_OPERASIONAL",
    ADD_PEMANTAUAN_OPERASIONAL: "ADD_PEMANTAUAN_OPERASIONAL",
    UPDATE_PEMANTAUAN_OPERASIONAL: "UPDATE_PEMANTAUAN_OPERASIONAL",
    DELETE_PEMANTAUAN_OPERASIONAL: "DELETE_PEMANTAUAN_OPERASIONAL",
};

export function receivePemantauanOperasionalActionCreator({ items, pagination }) {
    return {
        type: ActionType.RECEIVE_PEMANTAUAN_OPERASIONAL,
        payload: { items, pagination },
    };
}


export function addPemantauanOperasionalActionCreator(pemantauanOperasional) {
    return {
        type: ActionType.ADD_PEMANTAUAN_OPERASIONAL,
        payload: { pemantauanOperasional },
    };
}
export function updatePemantauanOperasionalActionCreator(pemantauanOperasional) {
    return {
        type: ActionType.UPDATE_PEMANTAUAN_OPERASIONAL,
        payload: { pemantauanOperasional },
    };
}


export function deletePemantauanOperasionalActionCreator(id) {
    return {
        type: ActionType.DELETE_PEMANTAUAN_OPERASIONAL,
        payload: { id },
    };
}
export function asyncReceivePemantauanOperasional(params = {}) {
    return async (dispatch) => {
        const result = getPayload(await pemantauanOperasionalApi.getAll(params));
        dispatch(receivePemantauanOperasionalActionCreator({
            items: result.items || [],
            pagination: result.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
        }));
        return result;
    };
}

export function asyncAddPemantauanOperasional(payload) {
    return async (dispatch) => {
        const pemantauanOperasional = getPayload(await pemantauanOperasionalApi.create(payload));
        dispatch(addPemantauanOperasionalActionCreator(pemantauanOperasional));
        return pemantauanOperasional;
    };
}

export function asyncUpdatePemantauanOperasional({ id, payload }) {
    return async (dispatch) => {
        const pemantauanOperasional = getPayload(await pemantauanOperasionalApi.update(id, payload));
        dispatch(updatePemantauanOperasionalActionCreator(pemantauanOperasional));
        return pemantauanOperasional;
    };
}

export function asyncDeletePemantauanOperasional(id) {
    return async (dispatch) => {
        await pemantauanOperasionalApi.remove(id);
        dispatch(deletePemantauanOperasionalActionCreator(id));
    };
}

export function asyncGetPemantauanOperasionalOptions() {
    return async () => {
        const result = getPayload(
            await pemantauanOperasionalApi.getOptions()
        );

        return result;
    };
}