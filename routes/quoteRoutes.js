import express from "express";
import {quotesController} from "../controller/quotesController.js";

const quoteRoutes = express.Router();
quoteRoutes.get("/", quotesController.getQuotes.bind(quotesController));

// eslint-disable-next-line import/prefer-default-export
export default quoteRoutes;
