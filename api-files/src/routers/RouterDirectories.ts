import { Router } from "express";
import { createDirectory, getDirectoriesByParent, getDirectoryByIdAndSatatus, getDirectoryRoot, updateDirectory } from "../controllers/DirectoryController";

const router = Router();

router.get('/getRoot/:username', getDirectoryRoot);
router.get('/list/:idRoot/:estado', getDirectoriesByParent);
router.get('/carpeta/:id/:estado', getDirectoryByIdAndSatatus);
router.post('/createDirectory/:nombre/:idParent', createDirectory);
router.put('/update', updateDirectory)

export default router;