import {noteService} from "../services/note-service.js";
import {quoteService} from "../services/quotes-service.js";
import createListItems from "../view/list.js";
import createEditPopUp, {createColorChooser, createValidityMessage} from "../view/edit.js";
import createQuote from "../view/quote.js";
import createStats from "../view/stats.js";

export default class NoteController {
    constructor() {
        this.themes = [
            {className: ""},
            {className: "dark-theme"},
            {className: "neon-theme"},
            {className: "rainbow-theme"},
        ];

        this.currentTheme = this.themes[0];

        this.entryModificationType = {
            complete: (id, state) => NoteController.setCompleteState(id, state),
            modify: (id) => this.editItem(id),
            delete: (id) => this.showDeletePopUp(id),
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
        this.renderStats();
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

        const deleteConfirmButtonElement = document.querySelector(".delete-confirm");
        if (deleteConfirmButtonElement) {
            deleteConfirmButtonElement.addEventListener("click", evt => {
                this.deleteItem(this.currentModifyingItem.id);
                NoteController.hideDeletePopUp();
            });
        }

        const deleteConfirmCancelButtonElement = document.querySelector(".delete-cancel");
        if (deleteConfirmCancelButtonElement) {
            deleteConfirmCancelButtonElement.addEventListener("click", evt => {
                NoteController.hideDeletePopUp();
            });
        }

        // actions from the edit-pane-buttons
        const actionButtonsElement = document.querySelector(".action-buttons");
        if (actionButtonsElement) {
            actionButtonsElement.addEventListener("click", (event) => {
                this.handleEditPopupAction(event.target.dataset.actionCommand);
                event.preventDefault();
            });
        }

        const navItemButtonsElement = document.querySelector(".item-nav-buttons");
        if (navItemButtonsElement) {
            navItemButtonsElement.addEventListener("click", (event) => {
                this.handleEditPopupAction(event.target.dataset.actionCommand);
                event.preventDefault();
            });
        }

        // add keypress-listener for + to add a new note faster
        document.addEventListener("keypress", (ev) => {
            if (ev.key === "+" && !NoteController.isEditPopUpVisible()) {
                this.createNewItem();
            }
        });

        // add keydown-listener for capturing special keys
        document.addEventListener("keydown", (ev) => {
            // esc, cancel edit-window
            if (ev.key === "Escape" && NoteController.isEditPopUpVisible()) {
                this.handleEditPopupAction("cancelAndClose");
            }
            // ctrl+s save note
            if (ev.ctrlKey && ev.key === "s" && NoteController.isEditPopUpVisible()) {
                this.handleEditPopupAction("save");
                ev.preventDefault(); // prevent the browser of trying to save the page
            }
            // ctrl+shift+s save note and close edit-window
            if (ev.ctrlKey && ev.shiftKey && ev.key === "S" && NoteController.isEditPopUpVisible()) {
                this.handleEditPopupAction("saveAndClose");
                this.renderItemList();
            }
            // left arrow
            if (ev.ctrlKey && ev.key === "ArrowLeft" && NoteController.isEditPopUpVisible()) {
                this.handleEditPopupAction("prev");
                this.renderItemList();
                ev.preventDefault();
            }
            // right arrow
            if (ev.ctrlKey && ev.key === "ArrowRight" && NoteController.isEditPopUpVisible()) {
                this.handleEditPopupAction("next");
                this.renderItemList();
                ev.preventDefault();
            }
            // space, toggle show/hide completed filter
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

    handleEditPopupAction(action) {
        switch (action) {
        case "save": {
            const saveRet = this.saveItem();
            if (saveRet === "") {
                this.renderItemEditPopUp(this.currentModifyingItem);
            } else {
                this.showValidityWarning(saveRet);
            }
            break;
        }
        case "saveAndClose": {
            const saveRet = this.saveItem();
            if (saveRet === "") {
                NoteController.hideEditPopUp();
                this.renderItemList();
            } else {
                this.showValidityWarning(saveRet);
            }
            break;
        }
        case "cancel":
            this.renderItemEditPopUp(this.currentModifyingItem);
            break;
        case "cancelAndClose":
            NoteController.hideEditPopUp();
            this.renderItemList();
            break;
        case "prev": {
            const prevNote = noteService.getPreviousNoteById(
                this.currentModifyingItem.id,
                this.currentSortAttribute,
                this.currentSortOrderAsc,
                this.currentHideCompleted,
            );
            if (prevNote != null) {
                this.currentModifyingItem = prevNote;
                this.renderItemEditPopUp(this.currentModifyingItem);
            }
            break;
        }
        case "next": {
            const nextNote = noteService.getNextNoteById(
                this.currentModifyingItem.id,
                this.currentSortAttribute,
                this.currentSortOrderAsc,
                this.currentHideCompleted,
            );
            if (nextNote != null) {
                this.currentModifyingItem = nextNote;
                this.renderItemEditPopUp(this.currentModifyingItem);
            }
            break;
        }
        default:
            break;
        }
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
        const note = noteService.createNewNote();
        this.currentModifyingItem = note;
        NoteController.showEditPopUp();
        this.renderItemEditPopUp(note);
    }

    editItem(id) {
        const note = noteService.getNoteById(id);
        this.currentModifyingItem = note;
        NoteController.showEditPopUp();
        this.renderItemEditPopUp(note);
    }

    deleteItem(id) {
        noteService.deleteNote(id);
        // re-render list
        this.renderItemList();
    }

    saveItem() {
        const formElement = document.querySelector(".edit-form");
        const titleElement = formElement.querySelector(".title-field");
        if (titleElement.value === "") {
            return "Please enter a title";
        }
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

        return "";
    }

    // return array of booleans
    showValidityWarning(text) {
        const validityMessageElement = document.querySelector(".validation-message");
        validityMessageElement.innerHTML = createValidityMessage(text);
    }

    colorSelectorChange(newColorIndex) {
        this.currentModifyingItem.color = newColorIndex;
        const editColorChooserElement = document.querySelector(".color-chooser-wrapper");
        editColorChooserElement.innerHTML = createColorChooser(this.currentModifyingItem);
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

    showDeletePopUp(id) {
        this.currentModifyingItem = noteService.getNoteById(id);
        const popupPane = document.querySelector(".confirm-delete-popup");
        popupPane.setAttribute("data-is-popup-visible", "true");
    }

    static hideDeletePopUp() {
        const popupPane = document.querySelector(".confirm-delete-popup");
        popupPane.setAttribute("data-is-popup-visible", "false");
    }

    renderItemList() {
        const todos = noteService.getNotes(
            this.currentSortAttribute,
            this.currentSortOrderAsc,
            this.currentHideCompleted,
        );

        const todoListElements = document.querySelector(".todos-list");
        if (todoListElements) {
            todoListElements.innerHTML = createListItems(todos);
        }
    }

    renderItemEditPopUp(todo) {
        const todoEditElement = document.querySelector(".edit-form-wrapper");
        todoEditElement.innerHTML = createEditPopUp(todo);

        // need to add event-listener for the color-chooser here, because it does not exist before
        // createEditPopUp is called
        const colorChooserElement = document.querySelector(".form-color-chooser");
        if (colorChooserElement) {
            colorChooserElement.addEventListener("change", (event) => {
                this.colorSelectorChange(event.target.selectedIndex);
            });
        }
    }

    renderQuote() {
        const quote = quoteService.getRandomQuote();
        const asideElement = document.querySelector(".aside-quote-wrapper");
        asideElement.innerHTML = createQuote(quote);
    }

    renderStats() {
        const statsElement = document.querySelector(".stats");
        if (statsElement) {
            statsElement.innerHTML = createStats(noteService.getAllNotesCount(),
                noteService.getCompletedNotesCount(),
                noteService.getOpenNotesCount(),
                noteService.getStorageName());
        }
    }
}

new NoteController().initialize();
