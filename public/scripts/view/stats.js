export default function createStats(total, completed, open, storageName) {
    return `
        <p>Total items: <span className="stats-total">${total}</span></p>
        <p>Completed items: <span className="stats-completed">${completed}</span></p>
        <p>Open items: <span className="stats-open">${open}</span></p>
        <p>Storage: <span className="stats-open">${storageName}</span></p>
    `;
}
