import {quoteStorage} from "../services/quoteStorage.js";

export class QuotesController {
    async getQuotes(req, res) {
        res.json(await quoteStorage.getAll() || []);
    }
}
export const quotesController = new QuotesController();
