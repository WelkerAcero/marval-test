import { Router } from "express";
import { UserController } from "../../app/Http/Controllers/UserController";

const CONTROLLER = new UserController();
const ROUTER = Router();

ROUTER.post('/login/user', CONTROLLER.authenticateAdmin);
ROUTER.post('/store/user', CONTROLLER.storeUser);

export default ROUTER;
