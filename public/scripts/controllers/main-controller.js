import {noteService} from "../services/note-service.js";
import createListItems from "../view/list.js";
import createEditPopUp from "../view/edit.js";

export default class NoteController {
    constructor() {
        this.themes = [
            {className: ""},
            {className: "dark-theme"},
            {className: "neon-theme"},
            {className: "psycho-theme"},
            {className: "debug-theme"},
        ];

        this.currentTheme = this.themes[0];

        this.entryModificationType = {
            complete: (id, state) => setCompleteState(id, state),
            modify: (id) => modifyItem(id),
            delete: (id) => deleteItem(id),
        };

        this.currentSortAttribute = "title";
        this.currentSortOrderAsc = true;
        this.currentSortButton = null;
        this.currentHideCompleted = false;
    }

    initialize() {
        this.currentSortButton = this.getActiveSortButton();
        this.initEventHandlers();
        noteService.load();
        this.renderItemList(noteService.getNotes(
            this.currentSortAttribute, this.currentSortOrderAsc, this.currentHideCompleted,
        ));
    }

    initEventHandlers() {
        const themeChangeButton = document.querySelector(".theme-changer");
        themeChangeButton.addEventListener("change", (event) => {
            const newTheme = this.themes[event.target.selectedIndex];
            if (this.currentTheme.className.length > 0) {
                document.body.classList.toggle(this.currentTheme.className);
            }
            if (newTheme.className.length > 0) {
                document.body.classList.toggle(newTheme.className);
            }
            this.currentTheme = newTheme;
        });

        const sortButtonsElement = document.querySelector(".sort-buttons");
        if (sortButtonsElement) {
            sortButtonsElement.addEventListener("click", (event) => {
                const btnDataSet = event.target.dataset;
                const sortAsc = (btnDataSet.sortAsc === "true");
                btnDataSet.sortAsc = (!sortAsc).toString();
                btnDataSet.isActive = "true";
                if (event.target !== this.currentSortButton) {
                    this.currentSortButton.dataset.isActive = "false";
                    this.currentSortButton = event.target;
                }
                this.currentSortOrderAsc = !sortAsc;
                if (btnDataSet.sortBy) {
                    this.currentSortAttribute = btnDataSet.sortBy;
                    this.renderItemList(noteService.getNotes(
                        this.currentSortAttribute,
                        this.currentSortOrderAsc,
                        this.currentHideCompleted,
                    ));
                }
            });
        }
        const createNewElement = document.querySelector(".new-button");
        if (createNewElement) {
            createNewElement.addEventListener("click", (event) => {
                console.log(event);
            });
        }
        const showCompletedSwitchElement = document.querySelector(".show-completed-switch");
        if (showCompletedSwitchElement) {
            showCompletedSwitchElement.addEventListener("click", (event) => {
                this.currentHideCompleted = !event.target.checked;
                this.renderItemList(noteService.getNotes(
                    this.currentSortAttribute, this.currentSortOrderAsc, this.currentHideCompleted,
                ));
            });
        }
        const entryListElement = document.querySelector(".todos-list");
        if (entryListElement) {
            entryListElement.addEventListener("click", (event) => {
                const editEvent = event.target.dataset.editEntry;
                const entryID = event.target.dataset.itemId;

                if (editEvent) {
                    const modifyFn = this.entryModificationType[editEvent];

                    if (event.target.checked) {
                        modifyFn(entryID, true);
                    } else {
                        modifyFn(entryID, false);
                    }
                }
            });
        }

        const actionButtonsElement = document.querySelector(".action-buttons");
        if (actionButtonsElement) {
            actionButtonsElement.addEventListener("click", (event) => {
                console.log(event.target);
                event.preventDefault();
            });
        }

        const navItemButtonsElement = document.querySelector(".item-nav-buttons");
        if (navItemButtonsElement) {
            navItemButtonsElement.addEventListener("click", (event) => {
                console.log(event.target);
                event.preventDefault();
            });
        }
    }

    getActiveSortButton() {
        return document.querySelector(".sort-button[data-is-active=\"true\"]");
    }

    renderItemList(todos) {
        // get DOM-List element
        const todoListElements = document.querySelector(".todos-list");
        todoListElements.innerHTML = createListItems(todos);
    }

    renderItemEditPopUp(todo) {
        const todoEditElement = document.querySelector(".edit-form-wrapper");
        todoEditElement.innerHTML = createEditPopUp(todo);
    }
}

new NoteController().initialize();
