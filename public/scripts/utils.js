export function getHumanReadableDate(dataAsNumber) {
    if (dataAsNumber < 0) {
        return "no date";
    }
    const ts = new Date(dataAsNumber);
    return ts.toLocaleString();
}

export function getDateAsISOString(dataAsNumber) {
    if (dataAsNumber < 0) {
        return "";
    }
    const ts = new Date(dataAsNumber);
    const dateAsISOString = ts.toISOString();
    return dateAsISOString.substr(0, dateAsISOString.length - 1); // remove Z at the end
}
