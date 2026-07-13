/* eslint-disable no-unused-vars */
import response from "../../utils/response.js";

export default class AuthController {
    constructor({ authService }) {
        this.authService = authService
    }

    //FR-01
    loginController = async (req, res, next) => {
        const { username, password } = req.validated;
        const { accessToken, refreshToken } = await this.authService.login({ username, password })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  24 * 60 * 60 * 1000,
        });

        return response(res, 200, 'Login berhasil', {
            accessToken,
        });
    };

    //FR-05
    logoutController = async (req, res, next) => {
        const { id } = req.user;
        const refreshToken = req.cookies.refreshToken;
        await this.authService.logout({ token: refreshToken })

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return response(res, 200, 'Logout berhasil');
    };

    newAccesToken = async (req, res, next) => {
        const token = req.cookies.refreshToken;
        const { accessToken } = await this.authService.newAccessToken({ token });
        return response(res, 200, '', { accessToken })
    }
}