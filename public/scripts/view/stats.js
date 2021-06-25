export default function createStats(total, completed, open, storageName) {
    return `
        <p>Total items: <span class="stats-total">${total}</span></p>
        <p>Completed items: <span class="stats-completed">${completed}</span></p>
        <p>Open items: <span class="stats-open">${open}</span></p>
        <p>Storage: <span class="stats-open">${storageName}</span></p>
    `;
}
