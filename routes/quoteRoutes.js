import express from "express";
import {quotesController} from "../controller/quotesController.js";

const router = express.Router();
router.get("/", quotesController.getQuotes.bind(quotesController));

export const quoteRoutes = router;
