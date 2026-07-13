import express from "express";
import authenticateToken from "../../middlewares/authenticate-token.js";
import isAdmin from "../../middlewares/is-admin.js";
export default function userRoute(userController, {
    validate,
    userPayloadValidatorPost,
    userIdParamValidator,
    userPayloadValidatorPut
}) {
    const router = express.Router();

    router.post(
        "",
        authenticateToken,
        isAdmin,
        validate(userPayloadValidatorPost),
        userController.createUserController
    );

    router.get(
        "",
        authenticateToken,
        isAdmin,
        userController.getAllUserController
    );

    router.get(
        "/me",
        authenticateToken,
        userController.getSelfController
    );


    router.delete(
        "/:id",
        authenticateToken,
        isAdmin,
        validate(userIdParamValidator, "params"),
        userController.deleteUserController
    );

    router.put(
        "/:id",
        authenticateToken,
        isAdmin,
        validate(userIdParamValidator, "params"),
        validate(userPayloadValidatorPut),
        userController.updateUserController
    );

    router.patch(
        "/active/:id",
        authenticateToken,
        isAdmin,
        validate(userIdParamValidator, "params"),
        userController.changeActiveController
    );


    router.patch(
        "/deactive/:id",
        authenticateToken,
        isAdmin,
        validate(userIdParamValidator, "params"),
        userController.changeDeactiveController
    );

    return router;
}