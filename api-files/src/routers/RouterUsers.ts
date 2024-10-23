import { Router } from "express";
import { getUsers, updateUser } from "../controllers/UsuarioController";
import { insertUser, searchUserByUsernamePassword } from './../controllers/UsuarioController';


const router = Router();

router.get('/', getUsers);
router.post('/create', insertUser);
router.get('/search/:username/:password', searchUserByUsernamePassword);
router.post('/update/:nuevaContra', updateUser);

export default router;