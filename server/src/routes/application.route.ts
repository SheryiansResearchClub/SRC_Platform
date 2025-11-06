import { applicationService } from "../services/application.service";
import express from "express";

const router = express.Router();

router.post("/", applicationService.createApplication);

router.get("/", applicationService.getAllApplications);

export default router;