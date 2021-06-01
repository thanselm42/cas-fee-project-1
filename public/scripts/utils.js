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
    // remove Z at the end otherwise the date-chooser can not handle it.
    return dateAsISOString.substr(0, dateAsISOString.length - 1);
}
