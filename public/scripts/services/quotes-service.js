import QuoteStorage from "./data/quote-storage.js";
import Quote from "./quote.js";

export class QuoteService {
    constructor(storage) {
        this.storage = storage || new QuoteStorage();
        this.quotes = [];
        this.load();
    }

    load() {
        this.quotes = this.storage.getAll().map((n) => new Quote(n.place,
            n.quote,
            n.movie,
            n.year));
    }

    getRandomQuote() {
        const rawRandom = Math.random();
        console.log(this.storage.length);
        const maxRandom = rawRandom * this.quotes.length;
        const random = Math.floor(maxRandom);
        return this.quotes[random];
    }
}

export const quoteService = new QuoteService();
