/* *************************************
  Mocks and testing
 ************************************** */
const constTODOs = [
    {id: 1, title: "Einkaufen", description: "Tomaten, Zwiebeln, Knoblauch, Spaghetti, Parmesan", importance: 1, cDate: 1621797650000, dueDate: 1621962800000, color: 0, isCompleted: false},
    {id: 2, title: "Kochen", description: "Sauce kochen, danach Spaghetti", importance: 3, cDate: 1621797620000, dueDate: 1621962800000, color: 1, isCompleted: true},
    {id: 3, title: "Putzen", description: "Staubsaugen und Fensterputzen", importance: 2, cDate: 1621797680000, dueDate: 1621962800000, color: 4, isCompleted: true},
    {id: 4, title: "Schlafen", description: "...selbsterklärend...", importance: 5, cDate: 1621797600000, dueDate: -1, color: 3, isCompleted: false},
];
let currentSortAttribute = "title";
let currentSortOrderAsc = true;
let currentSortButton;
let currentShowCompleted = true;

const constThemes = [
    {className: ""},
    {className: "dark-theme"},
    {className: "neon-theme"},
    {className: "psycho-theme"},
    {className: "debug-theme"},
];
let currentTheme = constThemes[0];

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

function filterCompleted(items, showCompleted) {
    if (showCompleted) {
        return items;
    }
    return items.filter((a) => a.isCompleted === false);
}

function createNewItem() {
    console.log("create new item");
}

function deleteItem(id) {
    console.log("deleting: " + id);
}

function modifyItem(id) {
    console.log("modifying: " + id);
}

function setCompleteState(id, isCompleted) {
    console.log("set completion state for " + id + " to " + isCompleted);
}

function createImportanceElement(importance) {
    return "&#10025 &#10025 &#10025 &#10025 &#10025";
}

function getHumanReadableDate(dataAsNumber) {
    if (dataAsNumber < 0) {
        return "no due date";
    }
    const ts = new Date(dataAsNumber);
    return ts.toLocaleString();
}

function getIsCompletedElement(isCompleted) {
    if (isCompleted) { return "checked=\"\""; }
    return "";
}

function getActiveSortButton() {
    return document.querySelector(".sort-button[data-is-active=\"true\"]");
}

function createListItem(todo) {
    return `
    <li>
        <div class="list-entry-container list-entry-color-${todo.color}" data-item-id="${todo.id}">
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
                <button class="list-entry-btn action-button" data-edit-entry="modify" data-item-id="${todo.id}" type="button">&#9998
                </button>
                <button class="list-entry-btn action-button" data-edit-entry="delete" data-item-id="${todo.id}" type="button">&#128465
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
    btnDataSet.isActive = "true";
    if (event.target !== currentSortButton) {
        currentSortButton.dataset.isActive = "false";
        currentSortButton = event.target;
    }
    currentSortOrderAsc = !sortAsc;
    if (btnDataSet.sortBy) {
        currentSortAttribute = btnDataSet.sortBy;
        renderItemList(filterCompleted(sortItemsBy(constTODOs,
            currentSortAttribute, currentSortOrderAsc), currentShowCompleted));
    }
}

const entryModificatonType = {
    complete: (id, state) => setCompleteState(id, state),
    modify: (id) => modifyItem(id),
    delete: (id) => deleteItem(id),
};

function bubbledClickItemEventHandler(event) {
    const editEvent = event.target.dataset.editEntry;
    const entryID = event.target.dataset.itemId;

    if (editEvent) {
        const modifyFn = entryModificatonType[editEvent];

        if (event.target.checked) {
            modifyFn(entryID, true);
        } else {
            modifyFn(entryID, false);
        }
    }
}

function themeChangeEventHandler(event) {
    const newTheme = constThemes[event.target.selectedIndex];
    if (currentTheme.className.length > 0) {
        document.body.classList.toggle(currentTheme.className);
    }
    if (newTheme.className.length > 0) {
        document.body.classList.toggle(newTheme.className);
    }
    currentTheme = newTheme;
}
function showCompletedEventHandler(event) {
    currentShowCompleted = event.target.checked;
    renderItemList(filterCompleted(sortItemsBy(
        constTODOs, currentSortAttribute, currentSortOrderAsc,
    ), currentShowCompleted));
}

function attachGlobalEventListeners() {
    const themeChangeButton = document.querySelector(".theme-changer");
    themeChangeButton.addEventListener("change", themeChangeEventHandler);

    const sortButtonsElement = document.querySelector(".sort-buttons");
    if (sortButtonsElement) {
        sortButtonsElement.addEventListener("click", bubbledClickSortButtonsEventHandler);
    }
    const createNewElement = document.querySelector(".new-button");
    if (createNewElement) {
        createNewElement.addEventListener("click", createNewItem);
    }
    const showCompletedSwitchElement = document.querySelector(".show-completed-switch");
    if (showCompletedSwitchElement) {
        showCompletedSwitchElement.addEventListener("click", showCompletedEventHandler);
    }
    const entryListElement = document.querySelector(".todos-list");
    if (entryListElement) {
        entryListElement.addEventListener("click", bubbledClickItemEventHandler);
    }
}

/* *********************
 Attach Event-Listeners
 */
currentSortButton = getActiveSortButton();
attachGlobalEventListeners();
renderItemList(sortItemsBy(constTODOs, currentSortAttribute, currentSortOrderAsc));
