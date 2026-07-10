import response from "../../utils/response.js";

/* eslint-disable no-unused-vars */
export default class UserController {
    constructor({ userService }) {
        this.userService = userService
    }

    getSelfController = async (req, res, next) => {
        const { id } = req.user;
        const user = await this.userService.getUserById({ id })
        console.log("controller:", user);
        return response(res, 200, '', { user });
    };

    createUserController = async (req, res, next) => {
        const { username, password } = req.validated;
        const user = await this.userService.createUser({ username, password });
        return response(res, 201, 'User telah dibuat.', { user })
    };

    deleteUserController = async (req, res, next) => {
        const { id } = req.params;
        await this.userService.deleteUser({ id });
        return response(res, 200, 'User telah dihapus.')
    };

    changeActiveController = async (req, res, next) => {
        const { id } = req.params;
        const user = await this.userService.changeActiveUser({ id, isActive: true });
        return response(res, 200, 'User berhasil di update.', { user })
    }

    changeDeactiveController = async (req, res, next) => {
        const { id } = req.params;
        const user = await this.userService.changeActiveUser({ id, isActive: false });
        return response(res, 200, 'User berhasil di update.', { user })
    }

    updateUserController = async (req, res, next) => {
        const { id } = req.params;
        const { username, password } = req.validated;
        const user = await this.userService.updateUser({ id, username, password });
        return response(res, 200, 'User berhasil di update.', { user })
    }

    getAllUserController = async (req, res, next) => {
        const { id } = req.user;
        const users = await this.userService.getAllUser({ id });
        return response(res, 200, '', { users });
    }
}