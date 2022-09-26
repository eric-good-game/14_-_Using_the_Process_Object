import { Request, Response, Router } from "express";
import randomController from "../controllers/randomController";

const router = Router();

router.get('/randoms',randomController.getRandomNumber)

export default router;