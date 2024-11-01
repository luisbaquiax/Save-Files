"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../controllers/UsuarioController");
const UsuarioController_2 = require("./../controllers/UsuarioController");
const router = (0, express_1.Router)();
router.get('/', UsuarioController_1.getUsers);
router.post('/create', UsuarioController_2.insertUser);
router.get('/search/:username/:password', UsuarioController_2.searchUserByUsernamePassword);
router.post('/update/:nuevaContra', UsuarioController_1.updateUser);
router.get('/users/:idUser', UsuarioController_1.getUsersByStatus);
router.get('/validacionUsers', UsuarioController_2.addUsersDefault);
exports.default = router;
