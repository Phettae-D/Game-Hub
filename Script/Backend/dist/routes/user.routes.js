"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
router.get('/:userId', UserController_1.UserController.getProfile);
router.put('/:userId', UserController_1.UserController.updateProfile);
exports.default = router;
//# sourceMappingURL=user.routes.js.map