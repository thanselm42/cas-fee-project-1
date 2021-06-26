function createQuote(quote) {
    return `<p class="quote-text">${quote.quote}</p>
            <p class="quote-movie">${quote.movie}, ${quote.year}</p>`;
}

export default function renderQuote(quote) {
    const asideElement = document.querySelector(".aside-quote-wrapper");
    asideElement.innerHTML = createQuote(quote);
}
