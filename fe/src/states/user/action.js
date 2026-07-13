import userApi from "../../api/user";

export const ActionType = {
    RECEIVE_USERS: 'RECEIVE_USERS',
    ADD_USER: 'ADD_USER',
    UPDATE_USER: 'UPDATE_USER',
    SET_USER_STATUS: 'SET_USER_STATUS',
    DELETE_USER: 'DELETE_USER',
};

export function receiveUsersActionCreator(users) {
    return {
        type: ActionType.RECEIVE_USERS,
        payload: { users },
    };
}

export function addUserActionCreator(user) {
    return {
        type: ActionType.ADD_USER,
        payload: { user },
    };
}

export function updateUserActionCreator(user) {
    return {
        type: ActionType.UPDATE_USER,
        payload: { user },
    };
}

export function setUserStatusActionCreator(user) {
    return {
        type: ActionType.SET_USER_STATUS,
        payload: { user },
    };
}

export function deleteUserActionCreator(id) {
    return {
        type: ActionType.DELETE_USER,
        payload: { id },
    };
}

export function asyncReceiveUser() {
    return async (dispatch) => {
        const users = await userApi.getAllUser();
        dispatch(receiveUsersActionCreator(users));
    };
}

export function asyncAddUser({ username, password, role }) {
    return async (dispatch) => {
        const user = await userApi.createUser({ username, password, role });
        dispatch(addUserActionCreator(user));
    };
}

export function asyncUpdateUser({ id, username, password, role }) {
    return async (dispatch) => {
        const user = await userApi.updateUser({ id, username, password, role });
        dispatch(updateUserActionCreator(user));
    };
}

export function asyncToggleUserStatus({ id, isActive }) {
    return async (dispatch) => {
        const { user } = isActive ? await userApi.deactivateUser(id) : await userApi.activateUser(id);
        dispatch(setUserStatusActionCreator(user));
    };
}

export function asyncDeleteUser(id) {
    return async (dispatch) => {
        await userApi.deleteUser(id);
        dispatch(deleteUserActionCreator(id));
    };
}