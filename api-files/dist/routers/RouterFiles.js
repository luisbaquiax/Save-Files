"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FileController_1 = require("../controllers/FileController");
const router = (0, express_1.Router)();
router.post('/create', FileController_1.createFile);
router.post('/shared/:archivoTipo', FileController_1.createFileShared);
router.post('/send-image', FileController_1.copyImage);
router.get('/list/:idRoot/:estado', FileController_1.getFilesByRootState);
router.put('/updateFile', FileController_1.updateFile);
router.put('/updateImage', FileController_1.updateImage);
router.get('/get-shareds/:username', FileController_1.getFileShareds);
router.get('/get-deleteds', FileController_1.getDeleteds);
exports.default = router;
