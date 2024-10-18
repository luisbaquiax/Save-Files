import { Router } from "express";
import { getDirectoryRoot } from "../controllers/DirectoryController";

const router = Router();

router.get('/getRoot/:username', getDirectoryRoot);

export default router;