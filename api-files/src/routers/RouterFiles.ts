import { Router } from "express"
import { copyImage, createFile, getFilesByRootState } from "../controllers/FileController";

const router = Router();

router.post('/create', createFile);
router.post('/send-image', copyImage);
router.get('/list/:idRoot/:estado', getFilesByRootState)

export default router;