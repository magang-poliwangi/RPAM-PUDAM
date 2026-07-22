import { userService } from "../container.js";
import { ForbiddenError } from "../exceptions/error.js";


export default async function isActive(req, res, next) {
    const { id } = req.user;
    const user = await userService.getUserById({id})
    if (!user.isActive) return next(new ForbiddenError("Akses dilarang"));
    return next();
}