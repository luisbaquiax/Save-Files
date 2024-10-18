"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DirectoryController_1 = require("../controllers/DirectoryController");
const router = (0, express_1.Router)();
router.get('/getRoot/:username', DirectoryController_1.getDirectoryRoot);
exports.default = router;
