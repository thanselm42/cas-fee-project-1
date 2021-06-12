// import QuoteStorageLocal from "./data/quote-storage-local.js";
import QuoteStorage from "./data/quote-storage-remote.js";
import Quote from "./quote.js";

export class QuoteService {
    constructor(storage) {
        this.storage = storage || new QuoteStorage();
        this.quotes = [];
        this.load();
    }

    load() {
        this.storage.getAll().then((value) => this.quotes = value);
    }

    getRandomQuote() {
        const rawRandom = Math.random();
        const maxRandom = rawRandom * this.quotes.length;
        const random = Math.floor(maxRandom);
        return this.quotes[random];
    }
}

export const quoteService = new QuoteService();
