export default class QuoteStorageLocal {
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
