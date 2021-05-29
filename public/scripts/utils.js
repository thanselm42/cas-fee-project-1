export default function getHumanReadableDate(dataAsNumber) {
    if (dataAsNumber < 0) {
        return "no date";
    }
    const ts = new Date(dataAsNumber);
    return ts.toLocaleString();
}
