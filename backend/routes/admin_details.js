import express from "express";
import { changeAdminPassword, createAdmin, emailSendAdmin, LoginAdmin} from "../controllers/admin_details.js";

const router = express.Router();

// Route to create a new admin user
router.post("/admin/create", createAdmin);
router.post("/admin/login", LoginAdmin);

router.post("/emailSendAdmin", emailSendAdmin);
router.post("/changeAdminPassword", changeAdminPassword);

export default router;
