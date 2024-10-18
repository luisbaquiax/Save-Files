import { Router } from "express";
import { getUsers } from "../controllers/UsuarioController";
import { insertUser, searchUserByUsernamePassword } from './../controllers/UsuarioController';


const router = Router();

router.get('/', getUsers);
router.post('/create', insertUser)
router.get('/search/:username/:password', searchUserByUsernamePassword)

export default router;