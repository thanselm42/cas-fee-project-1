import {quoteStorage} from "../services/quoteStorage.js";

export class QuotesController {
    // eslint-disable-next-line class-methods-use-this
    async getQuotes(req, res) {
        res.json(await quoteStorage.getAll() || []);
    }
}
export const quotesController = new QuotesController();
