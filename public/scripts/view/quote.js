export default function createQuote(quote) {
    return `<p class="quote-text">${quote.quote}</p>
            <p class="quote-movie">${quote.movie}, ${quote.year}</p>`;
}
