import {httpService} from "../util/http-service.js";

export default class QuoteStorage {
    constructor() {
        this.apiURL = "/api/v1/quotes/";
    }

    async getAll() {
        const quotes = await httpService.ajax("GET", this.apiURL, undefined);
        return quotes;
    }
}
