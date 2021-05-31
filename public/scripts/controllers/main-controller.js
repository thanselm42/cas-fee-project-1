import {noteService} from "../services/note-service.js";
import {quoteService} from "../services/quotes-service.js";
import createListItems from "../view/list.js";
import createEditPopUp from "../view/edit.js";
import createQuote from "../view/quote.js";

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
            complete: (id, state) => NoteController.setCompleteState(id, state),
            modify: (id) => this.editItem(id),
            delete: (id) => this.deleteItem(id),
        };

        this.currentSortAttribute = "title";
        this.currentSortOrderAsc = true;
        this.currentSortButton = null;
        this.currentHideCompleted = false;
        this.currentModifyingItem = null;
    }

    initialize() {
        this.currentSortButton = NoteController.getActiveSortButton();
        this.initEventHandlers();
        this.initThemes();
        noteService.load();
        quoteService.load();
        this.renderItemList();
        this.renderQuote();
    }

    initEventHandlers() {
        const themeChangeButton = document.querySelector(".theme-changer");
        themeChangeButton.addEventListener("change", (event) => {
            const newTheme = this.themes[event.target.selectedIndex];
            this.changeTheme(newTheme);
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
                    this.renderItemList();
                }
            });
        }
        const createNewElement = document.querySelector(".new-button");
        if (createNewElement) {
            // eslint-disable-next-line no-unused-vars
            createNewElement.addEventListener("click", (event) => { this.createNewItem(); });
        }
        const showCompletedSwitchElement = document.querySelector(".show-completed-switch");
        if (showCompletedSwitchElement) {
            showCompletedSwitchElement.addEventListener("click", (event) => {
                this.currentHideCompleted = !event.target.checked;
                this.renderItemList();
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

        const colorChooserElement = document.querySelector(".form-color-chooser");
        if (colorChooserElement) {
            colorChooserElement.addEventListener("change", (event) => {
                console.log(`Chooser! ${event}`);
            });
        }

        // actions from the edit-pane-buttons
        const actionButtonsElement = document.querySelector(".action-buttons");
        if (actionButtonsElement) {
            actionButtonsElement.addEventListener("click", (event) => {
                switch (event.target.dataset.actionCommand) {
                case "save":
                    this.saveItem();
                    NoteController.renderItemEditPopUp(this.currentModifyingItem);
                    break;
                case "saveAndClose":
                    this.saveItem();
                    NoteController.hideEditPopUp();
                    this.renderItemList();
                    break;
                case "cancel":
                    NoteController.renderItemEditPopUp(this.currentModifyingItem);
                    break;
                case "cancelAndClose":
                    NoteController.hideEditPopUp();
                    this.renderItemList();
                    break;
                default:
                    break;
                }
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

        // add key-listener for + to add a new note faster
        document.addEventListener("keypress", (ev) => {
            if (ev.key === "+" && !NoteController.isEditPopUpVisible()) {
                this.createNewItem();
            }
        });

        // add key-listener for esc to cancel the edit-window
        document.addEventListener("keydown", (ev) => {
            if (ev.key === "Escape" && NoteController.isEditPopUpVisible()) {
                NoteController.hideEditPopUp();
                this.renderItemList();
            }
            if (ev.code === "Space" && !NoteController.isEditPopUpVisible()) {
                this.currentHideCompleted = !this.currentHideCompleted;
                if (this.currentHideCompleted) {
                    document.querySelector(".show-completed-switch").removeAttribute("checked");
                } else {
                    document.querySelector(".show-completed-switch").setAttribute("checked", "true");
                }
                this.renderItemList();
            }
        });
    }

    initThemes() {
        // get system color-scheme
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

        // if the system is set to dark-mode, use dark-mode as well
        if (prefersDarkScheme.matches) {
            document.querySelector(".theme-changer option[value=\"darkTheme\"]").setAttribute("selected", "true");
            this.changeTheme(this.themes[1]);
        } else {
            document.querySelector(".theme-changer option[value=\"defaultTheme\"]").setAttribute("selected", "true");
            this.changeTheme(this.themes[0]);
        }
    }

    changeTheme(newTheme) {
        if (this.currentTheme.className.length > 0) {
            document.body.classList.toggle(this.currentTheme.className);
        }
        if (newTheme.className.length > 0) {
            document.body.classList.toggle(newTheme.className);
        }
        this.currentTheme = newTheme;
    }

    static setCompleteState(id, state) {
        const note = noteService.getNoteById(id);
        note.isCompleted = state;
        noteService.updateNote(note);
        // re-rendering is not necessary, because the checkbox has already the correct state
    }

    createNewItem() {
        console.log("create new item");
        const note = noteService.createNewNote();
        this.currentModifyingItem = note;
        NoteController.showEditPopUp();
        NoteController.renderItemEditPopUp(note);
    }

    editItem(id) {
        console.log(`modifying: ${id}`);
        const note = noteService.getNoteById(id);
        this.currentModifyingItem = note;
        // show edit-popup
        NoteController.showEditPopUp();
        NoteController.renderItemEditPopUp(note);
    }

    editNextItem() {

    }

    editPreviousItem() {

    }

    deleteItem(id) {
        console.log(`deleting: ${id}`);
        //   const note = noteService.getNoteById(id);
        // show delete-popup
        // remove note from service
        noteService.deleteNote(id);
        // re-render list
        this.renderItemList();
    }

    saveItem() {
        // TODO: validate input!!!
        const formElement = document.querySelector(".edit-form");
        // console.log(formElement.checkValidity()); //check form
        const titleElement = formElement.querySelector(".title-field");
        this.currentModifyingItem.title = titleElement.value;
        const descriptionElement = formElement.querySelector(".description-field");
        this.currentModifyingItem.description = descriptionElement.value;
        this.currentModifyingItem.importance = Number(formElement.querySelector(".importance-field input:checked").getAttribute("value")).valueOf();
        const colorElement = formElement.querySelector(".form-color-chooser");
        this.currentModifyingItem.color = colorElement.selectedIndex;
        const dueDateElement = formElement.querySelector(".duedate-field");
        if (dueDateElement.value.length === 0) {
            this.currentModifyingItem.dueDate = -1;
        } else {
            this.currentModifyingItem.dueDate = dueDateElement.value;
        }
        this.currentModifyingItem.modificationDate = new Date().valueOf();

        // update store
        noteService.updateNote(this.currentModifyingItem);
    }

    // return array of booleans
    checkFormValidity() {
    }

    static isEditPopUpVisible() {
        const isVisibleAttribute = document.querySelector(".edit-pane").getAttribute("data-is-popup-visible");
        if (isVisibleAttribute === "true") {
            return true;
        }
        return false;
    }

    static getActiveSortButton() {
        return document.querySelector(".sort-button[data-is-active=\"true\"]");
    }

    static showEditPopUp() {
        const popupPane = document.querySelector(".edit-pane");
        popupPane.setAttribute("data-is-popup-visible", "true");
    }

    static hideEditPopUp() {
        const popupPane = document.querySelector(".edit-pane");
        popupPane.setAttribute("data-is-popup-visible", "false");
    }

    renderItemList() {
        const todos = noteService.getNotes(
            this.currentSortAttribute,
            this.currentSortOrderAsc,
            this.currentHideCompleted,
        );

        // get DOM-List element
        const todoListElements = document.querySelector(".todos-list");
        todoListElements.innerHTML = createListItems(todos);
    }

    static renderItemEditPopUp(todo) {
        const todoEditElement = document.querySelector(".edit-form-wrapper");
        todoEditElement.innerHTML = createEditPopUp(todo);
    }

    renderQuote() {
        const quote = quoteService.getRandomQuote();
        const asideElement = document.querySelector(".aside-quote-wrapper");
        asideElement.innerHTML = createQuote(quote);
    }
}

new NoteController().initialize();
