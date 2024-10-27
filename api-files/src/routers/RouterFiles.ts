import { Router } from "express"
import { copyImage, createFile, createFileShared, getFilesByRootState, getFileShareds, updateFile } from "../controllers/FileController";

const router = Router();

router.post('/create', createFile);
router.post('/shared/:archivoTipo', createFileShared);
router.post('/send-image', copyImage);
router.get('/list/:idRoot/:estado', getFilesByRootState);
router.put('/updateFile', updateFile);
router.get('/get-shareds/:username', getFileShareds)

export default router;