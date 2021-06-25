import fs from "fs";

export class QuoteStorage {
    constructor() {
        try {
            const data = fs.readFileSync("./data/quotes.json", "utf8");
            this.quotes = JSON.parse(data);
        } catch (err) {
            console.error(err);
        }
    }

    async getAll() {
        return this.quotes;
    }
}
export const quoteStorage = new QuoteStorage();
