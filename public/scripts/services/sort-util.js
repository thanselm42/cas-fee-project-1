function sortNumberAsc(a, b) {
    return a - b;
}

function sortNumberDesc(a, b) {
    return b - a;
}

function sortStringAsc(a, b) {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
}

function sortStringDesc(a, b) {
    if (b > a) {
        return 1;
    }
    if (b < a) {
        return -1;
    }
    return 0;
}

function sortBooleanAsc(a, b) {
    if (a === b) {
        return 0;
    }
    if (a) {
        return -1;
    }
    return 1;
}

function sortBooleanDesc(a, b) {
    if (a === b) {
        return 0;
    }
    if (a) {
        return 1;
    }
    return -1;
}

const sortTypeAsc = {
    string: (a, b) => sortStringAsc(a, b),
    number: (a, b) => sortNumberAsc(a, b),
    boolean: (a, b) => sortBooleanAsc(a, b),
};

const sortTypeDesc = {
    string: (a, b) => sortStringDesc(a, b),
    number: (a, b) => sortNumberDesc(a, b),
    boolean: (a, b) => sortBooleanDesc(a, b),
};

export function sortItemsBy(items, sort, asc) {
    console.log(sort);
    let sortFn;
    if (asc) {
        sortFn = sortTypeAsc[typeof (items[0][sort])];
    } else {
        sortFn = sortTypeDesc[typeof (items[0][sort])];
    }

    return [...items].sort((a, b) => sortFn(a[sort], b[sort]));
}

export function filterCompleted(items, hideCompleted) {
    if (!hideCompleted) {
        return items;
    }
    return items.filter((a) => a.isCompleted === false);
}
