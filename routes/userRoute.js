import express from "express";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
import { getNotificationsController } from '../controllers/userController.js'
import formidable from "express-formidable";

const router = express.Router();

// Routes 

// notifications 
router.post('/notifications', requireSignIn, getNotificationsController);

export default router;