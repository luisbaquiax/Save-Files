"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FileController_1 = require("../controllers/FileController");
const router = (0, express_1.Router)();
router.post('/create', FileController_1.createFile);
router.get('/list/:idRoot/:estado', FileController_1.getFilesByRootState);
exports.default = router;
