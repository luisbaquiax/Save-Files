import { Router } from "express"
import { copyImage, createFile, createFileShared, getDeleteds, getFilesByRootState, getFileShareds, updateFile, updateImage } from "../controllers/FileController";

const router = Router();

router.post('/create', createFile);
router.post('/shared/:archivoTipo', createFileShared);
router.post('/send-image', copyImage);
router.get('/list/:idRoot/:estado', getFilesByRootState);
router.put('/updateFile', updateFile);
router.put('/updateImage', updateImage);
router.get('/get-shareds/:username', getFileShareds);
router.get('/get-deleteds', getDeleteds);

export default router;