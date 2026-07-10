import express from "express";
import authenticateToken from "../../middlewares/authenticate-token.js";

export default function authRoute(authController, {
    loginLimiter,
    validate,
    authenticationPayloadValidatorPost,
}) {
    const router = express.Router();

    router.post(
        "",
        loginLimiter,
        validate(authenticationPayloadValidatorPost),
        authController.loginController
    );
    router.delete(
        "",
        authenticateToken,
        authController.logoutController
    );

    router.put(
        "",
        authController.newAccesToken
    );
    return router;
}