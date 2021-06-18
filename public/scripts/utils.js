export function getHumanReadableDate(dataAsNumber) {
    if (dataAsNumber < 0) {
        return "no date";
    }
    const ts = new Date(dataAsNumber);
    return ts.toLocaleString();
}

export function getLocalDateTimeAsISOString(dataAsNumber) {
    if (dataAsNumber < 0) {
        return "";
    }
    const ts = new Date(dataAsNumber);
    return `${ts.getFullYear()}-${(ts.getMonth() + 1).toString().padStart(2, "0")}-
        ${ts.getDate().toString().padStart(2, "0")}T
        ${ts.getHours().toString().padStart(2, "0")}:
        ${ts.getMinutes().toString().padStart(2, "0")}:${ts.getSeconds().toString().padStart(2, "0")}.000`;
}
