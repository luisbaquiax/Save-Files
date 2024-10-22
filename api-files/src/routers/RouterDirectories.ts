import { Router } from "express";
import { createDirectory, getDirectoriesByParent, getDirectoryByIdAndSatatus, getDirectoryRoot } from "../controllers/DirectoryController";

const router = Router();

router.get('/getRoot/:username', getDirectoryRoot);
router.get('/list/:idRoot/:estado', getDirectoriesByParent);
router.get('/carpeta/:id/:estado', getDirectoryByIdAndSatatus);
router.post('/createDirectory/:nombre/:idParent', createDirectory)

export default router;