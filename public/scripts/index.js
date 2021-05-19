/*

 */
const themeButton = document.getElementById("theme-toggle-button");

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("debug-theme");
});

/*
 * Sorting stuff
*/

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

function sortItemsBy(items, sort, asc) {
    let sortFn;

    if (asc) {
        sortFn = sortTypeAsc[typeof (items[0][sort])];
    } else {
        sortFn = sortTypeDesc[typeof (items[0][sort])];
    }

    return [...items].sort((a, b) => sortFn(a[sort], b[sort]));
}

/*
Mocks and testing
 */

const someTODOs = [
    {title: "Einkaufen", importance: 1, dueDate: 1001, isCompleted: false},
    {title: "Kochen", importance: 3, dueDate: 1000, isCompleted: true},
    {title: "Putzen", importance: 2, dueDate: 1005, isCompleted: true},
    {title: "Schlafen", importance: 5, dueDate: 1010, isCompleted: false},
];

console.log(sortItemsBy(someTODOs, "isCompleted", false));
