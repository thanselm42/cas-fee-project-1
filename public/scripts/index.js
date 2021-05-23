/* *************************************
  Mocks and testing
 ************************************** */
const constTODOs = [
    {id: 1, title: "Einkaufen", description: "Tomaten, Zwiebeln, Knoblauch, Spaghetti, Parmesan", importance: 1, cDate: 10, dueDate: 1001, isCompleted: false},
    {id: 2, title: "Kochen", description: "Sauce kochen, danach Spaghetti", importance: 3, cDate: 12, dueDate: 1000, isCompleted: true},
    {id: 3, title: "Putzen", description: "Staubsaugen und Fensterputzen", importance: 2, cDate: 13, dueDate: 1005, isCompleted: true},
    {id: 4, title: "Schlafen", description: "...selbsterklärend...", importance: 5, cDate: 20, dueDate: 1010, isCompleted: false},
];
let currentSortAttribute = "id";

/* *************************************
  Sorting stuff
 ************************************* */

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
    const buttonSongId = event.target.dataset.songId;
    if (buttonSongId) {
        const beforeSongIndex = getSongIndex(buttonSongId);
        const buttonDelta = Number(event.target.dataset.delta);
        rate(buttonSongId, buttonDelta);
        const afterSongIndex = getSongIndex(buttonSongId);
        if (afterSongIndex !== beforeSongIndex) {
            wiggleSongElement(buttonSongId);
        }
    }
 */

function createNewItem() {

}

function deleteItem(id) {

}

function editItem(id) {

}

function setCompleteState(id,isCompleted) {

}

function createImportanceElement(importance) {
    return "* * * * *";
}

function getHumanReadableDate(dataAsNumber) {
    return "18:00 - 26.05.2021";
}

function getIsCompletedElement(isCompleted) {
    if (isCompleted) { return "checked=\"\""; }
    return "";
}

function createListItem(todo) {
    return `
    <li>
        <div class="list-entry-container" data-item-id="${todo.id}">
            <div class="list-entry-main">
                <p class="list-entry-title">${todo.title}</p>
                <p class="list-entry-importance">${createImportanceElement(todo.importance)}</p>
                <p class="list-entry-due-date">${getHumanReadableDate(todo.dueDate)}</p>
                <textarea class="list-entry-description" readOnly="">${todo.description}</textarea>
            </div>
            <div class="list-entry-buttons">
                <input class="list-entry-btn" type="checkbox"
                       name="todos_list_entry_is_completed"
                       data-edit-entry="complete" ${getIsCompletedElement(todo.isCompleted)}
                       data-item-id="${todo.id}"> <!-- &#9989 -->
                <button class="list-entry-btn" data-edit-entry="edit" data-item-id="${todo.id}" type="button">&#9998
                </button>
                <button class="list-entry-btn" data-edit-entry="delete" data-item-id="${todo.id}" type="button">&#128465
                </button>
            </div>
        </div>
    </li>`;
}

function createListItems(todoList) {
    return todoList.map((value) => createListItem(value)).join("");
}

function renderItemList(todos) {
    // get DOM-List element
    const todoListElements = document.querySelector(".todos-list");
    todoListElements.innerHTML = createListItems(todos);
}

function bubbledClickSortButtonsEventHandler(event) {
    const btnDataSet = event.target.dataset;
    const sortAsc = (btnDataSet.sortAsc === "true");
    btnDataSet.sortAsc = !sortAsc;

    if (btnDataSet.sortBy) {
        currentSortAttribute = btnDataSet.sortBy;
        renderItemList(sortItemsBy(constTODOs, currentSortAttribute, sortAsc));
    }
}

const entryModificatonType = { // entry modification type
    complete: (id, state) => setCompleteState(id, state),
    edit: (id) => sortNumberDesc(id),
    delete: (id) => sortBooleanDesc(id),
};

function bubbledClickItemEventHandler(event) {
    console.log(event);
    const editEvent = event.target.dataset.editEntry;
    const entryID = event.target.dataset.itemId;
    console.log(entryID + "\t" + editEvent);

    if (editEvent) {

    }
}

function attachGlobalEventListeners() {
    const themeButton = document.getElementById("theme-toggle-button");
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("debug-theme");
    });

    const sortButtonsElement = document.querySelector(".sort-buttons");
    sortButtonsElement.addEventListener("click", bubbledClickSortButtonsEventHandler);

    const createNewElement = document.querySelector(".new-button");
    createNewElement.addEventListener("click", createNewElement);

    const entryListElement = document.querySelector(".todos-list");
    entryListElement.addEventListener("click", bubbledClickItemEventHandler);
}

/* *********************
 Attach Event-Listeners
 */
attachGlobalEventListeners();
renderItemList(sortItemsBy(constTODOs, currentSortAttribute, true));
