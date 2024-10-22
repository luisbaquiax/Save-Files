import { Router } from "express"
import { createFile, getFilesByRootState } from "../controllers/FileController";

const router = Router();

router.post('/create', createFile);
router.get('/list/:idRoot/:estado', getFilesByRootState)

export default router;