import express,{ Router } from "express";
import path from "path";

const router = Router();

router.use(require('express-status-monitor')())
//view the socket.io server status
router.use("/socket", express.static(path.join(__dirname, "./view")));
export default router;