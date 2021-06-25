// import QuoteStorageLocal from "./data/quote-storage-local.js";
import QuoteStorage from "./data/quote-storage-remote.js";

export class QuoteService {
    constructor(storage) {
        this.storage = storage || new QuoteStorage();
        this.quotes = [];
        this.load();
    }

    async load() {
        this.quotes = await this.storage.getAll();
    }

    getRandomQuote() {
        const rawRandom = Math.random();
        const maxRandom = rawRandom * this.quotes.length;
        const random = Math.floor(maxRandom);
        return this.quotes[random];
    }
}

export const quoteService = new QuoteService();
