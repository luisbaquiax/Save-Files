import { Router } from "express";
import { getUsers, getUsersByStatus, updateUser } from "../controllers/UsuarioController";
import { insertUser, searchUserByUsernamePassword, addUsersDefault } from './../controllers/UsuarioController';


const router = Router();

router.get('/', getUsers);
router.post('/create', insertUser);
router.get('/search/:username/:password', searchUserByUsernamePassword);
router.post('/update/:nuevaContra', updateUser);
router.get('/users/:idUser', getUsersByStatus);
router.get('/validacionUsers', addUsersDefault);


export default router;