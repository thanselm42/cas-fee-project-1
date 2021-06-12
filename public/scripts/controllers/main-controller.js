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
            complete: (id, state) => this.setCompleteState(id, state),
            modify: (id) => this.editItem(id),
            delete: (id) => this.showDeletePopUp(id),
        };

        this.showTimerBasedNotifications = false;

        this.currentSortAttribute = "title";
        this.currentSortOrderAsc = true;
        this.currentSortButton = null;
        this.currentHideCompleted = false;
        this.currentModifyingItem = null;
    }

    async initialize() {
        this.currentSortButton = NoteController.getActiveSortButton();
        await this.initEventHandlers();
        this.initThemes();
        quoteService.load();
        await this.renderItemList();
        this.renderQuote();
        await this.renderStats();
        await this.initNotification();
    }

    async initNotification() {
        this.notificationPermission = Notification.permission;
        if (this.notificationPermission !== "granted") {
            this.notificationPermission = await Notification.requestPermission();
        }
        if (this.showTimerBasedNotifications) {
            this.workerThread = new Worker("./scripts/controllers/note-timer.js");
            this.workerThread.onmessage = (ev) => this.notificationCheck(ev);
        }
        await this.notificationCheck();
    }

    initEventHandlers() {
        const themeChangeButton = document.querySelector(".theme-changer");
        themeChangeButton.addEventListener("change", (event) => {
            const newTheme = this.themes[event.target.selectedIndex];
            this.changeTheme(newTheme);
        });

        const sortButtonsElement = document.querySelector(".sort-buttons");
        if (sortButtonsElement) {
            sortButtonsElement.addEventListener("click", async (event) => {
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
                    await this.renderItemList();
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
            showCompletedSwitchElement.addEventListener("click", async (event) => {
                this.currentHideCompleted = !event.target.checked;
                await this.renderItemList();
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
            deleteConfirmButtonElement.addEventListener("click", async (evt) => {
                await this.deleteItem(this.currentModifyingItem.id);
                NoteController.hideDeletePopUp();
            });
        }

        const deleteConfirmCancelButtonElement = document.querySelector(".delete-cancel");
        if (deleteConfirmCancelButtonElement) {
            deleteConfirmCancelButtonElement.addEventListener("click", (evt) => {
                NoteController.hideDeletePopUp();
            });
        }

        // actions from the edit-pane-buttons
        const actionButtonsElement = document.querySelector(".action-buttons");
        if (actionButtonsElement) {
            actionButtonsElement.addEventListener("click", async (event) => {
                await this.handleEditPopupAction(event.target.dataset.actionCommand);
                event.preventDefault();
            });
        }

        const navItemButtonsElement = document.querySelector(".item-nav-buttons");
        if (navItemButtonsElement) {
            navItemButtonsElement.addEventListener("click", async (event) => {
                await this.handleEditPopupAction(event.target.dataset.actionCommand);
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
        document.addEventListener("keydown", async (ev) => {
            // esc, cancel edit-window
            if (ev.key === "Escape" && NoteController.isEditPopUpVisible()) {
                await this.handleEditPopupAction("cancelAndClose");
            }
            // ctrl+s save note
            if (ev.ctrlKey && ev.key === "s" && NoteController.isEditPopUpVisible()) {
                await this.handleEditPopupAction("save");
                ev.preventDefault(); // prevent the browser of trying to save the page
            }
            // ctrl+shift+s save note and close edit-window
            if (ev.ctrlKey && ev.shiftKey && ev.key === "S" && NoteController.isEditPopUpVisible()) {
                await this.handleEditPopupAction("saveAndClose");
                await this.renderItemList();
            }
            // left arrow
            if (ev.ctrlKey && ev.key === "ArrowLeft" && NoteController.isEditPopUpVisible()) {
                await this.handleEditPopupAction("prev");
                await this.renderItemList();
                ev.preventDefault();
            }
            // right arrow
            if (ev.ctrlKey && ev.key === "ArrowRight" && NoteController.isEditPopUpVisible()) {
                await this.handleEditPopupAction("next");
                await this.renderItemList();
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
                await this.renderItemList();
            }
        });
    }

    async handleEditPopupAction(action) {
        switch (action) {
        case "save": {
            const saveRet = await this.saveItem();
            if (saveRet === "") {
                this.renderItemEditPopUp(this.currentModifyingItem);
            } else {
                this.showValidityWarning(saveRet);
            }
            break;
        }
        case "saveAndClose": {
            const saveRet = await this.saveItem();
            if (saveRet === "") {
                NoteController.hideEditPopUp();
                await this.renderItemList();
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
            await this.renderItemList();
            break;
        case "prev": {
            const prevNote = await noteService.getPreviousNoteById(
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
            const nextNote = await noteService.getNextNoteById(
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

    async setCompleteState(id, state) {
        const note = await noteService.getNoteById(id);
        note.isCompleted = state;
        await noteService.updateNote(note);
        // re-rendering is not necessary, because the checkbox has already the correct state
    }

    createNewItem() {
        const note = noteService.createNewNote();
        this.currentModifyingItem = note;
        NoteController.showEditPopUp();
        this.renderItemEditPopUp(note);
    }

    async editItem(id) {
        const note = await noteService.getNoteById(id);
        this.currentModifyingItem = note;
        NoteController.showEditPopUp();
        this.renderItemEditPopUp(note);
    }

    async deleteItem(id) {
        await noteService.deleteNote(id);
        // re-render list
        await this.renderItemList();
    }

    async saveItem() {
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

        // check if it is a new note and add note or update store
        if (this.currentModifyingItem.id !== "") {
            await noteService.updateNote(this.currentModifyingItem);
        } else {
            await noteService.addNote(this.currentModifyingItem);
        }

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

    async showDeletePopUp(id) {
        this.currentModifyingItem = await noteService.getNoteById(id);
        const popupPane = document.querySelector(".confirm-delete-popup");
        popupPane.setAttribute("data-is-popup-visible", "true");
    }

    async notificationCheck() {
        const now = new Date();
        const notes = await noteService.getAllOpenNotesUnSorted();
        // check for notes where the due-date will expire in the next 10 minutes
        const filteredNotes = notes.filter((value) => value.dueDate > 0
            && (value.dueDate <= now.valueOf() + (1000 * 60 * 10)));
        this.showNotification(filteredNotes);
    }

    showNotification(ids) {
        let notificationMessage;
        if (Array.isArray(ids)) {
            notificationMessage = "There are several uncompleted TODOs that have reached the due-date or will reach the due-date soon!";
        } else {
            notificationMessage = `The Due-Date for ${ids[0].title} has already been reached or will be reached soon`;
        }

        if (this.notificationPermission === "granted") {
            this.greeting = new Notification(notificationMessage);
        }
    }

    static hideDeletePopUp() {
        const popupPane = document.querySelector(".confirm-delete-popup");
        popupPane.setAttribute("data-is-popup-visible", "false");
    }

    async renderItemList() {
        const todos = await noteService.getNotes(
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

    async renderStats() {
        const statsElement = document.querySelector(".stats");
        if (statsElement) {
            statsElement.innerHTML = createStats(await noteService.getAllNotesCount(),
                await noteService.getCompletedNotesCount(),
                await noteService.getOpenNotesCount(),
                await noteService.getStorageName());
        }
    }
}

new NoteController().initialize();
