export default class QuoteStorage {
    constructor() {
        const request = new XMLHttpRequest();
        request.open("GET", "./resource/quotes.json", false);
        request.send(null);
        this.quotes = JSON.parse(request.responseText);
    }

    getAll() {
        return this.quotes;
    }
}
