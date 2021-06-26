import {noteService} from "../services/note-service.js";
import EditView from "../view/edit.js";
import ListView from "../view/list.js";

class NoteController {
    constructor() {
        this.entryModificationType = {
            complete: (id, state) => this.setCompleteState(id, state),
            modify: (id) => this.editItem(id),
            delete: (id) => this.showDeletePopUp(id),
        };

        this.currentSortAttribute = "creationDate";
        this.currentSortOrderAsc = true;
        this.currentHideCompleted = false;
        this.currentModifyingItem = null;
    }

    async initialize() {
        this.currentSortButton = EditView.getActiveSortButton();
        if (this.currentSortButton) {
            this.currentSortAttribute = this.currentSortButton.dataset.sortBy;
        }

        await this.initEventHandlers();
        await this.refreshItemList();
    }

    initEventHandlers() {
        // Sort-Buttons
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
                    await this.refreshItemList();
                }
            });
        }

        // Create New event
        const createNewElement = document.querySelector(".new-button");
        if (createNewElement) {
            // eslint-disable-next-line no-unused-vars
            createNewElement.addEventListener("click", () => { this.createNewItem(); });
        }

        // show / hide completed Switch event
        const showCompletedSwitchElement = document.querySelector(".show-completed-switch");
        if (showCompletedSwitchElement) {
            showCompletedSwitchElement.addEventListener("click", async (event) => {
                this.currentHideCompleted = !event.target.checked;
                await this.refreshItemList();
            });
        }

        // bubble-events for all modifications on list-items
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

        // delete-confirmation event
        const deleteConfirmButtonElement = document.querySelector(".delete-confirm");
        if (deleteConfirmButtonElement) {
            // eslint-disable-next-line no-unused-vars
            deleteConfirmButtonElement.addEventListener("click", async () => {
                await this.deleteItem(this.currentModifyingItem.id);
                ListView.hideDeletePopUp();
            });
        }

        // delete-cancel event
        const deleteConfirmCancelButtonElement = document.querySelector(".delete-cancel");
        if (deleteConfirmCancelButtonElement) {
            // eslint-disable-next-line no-unused-vars
            deleteConfirmCancelButtonElement.addEventListener("click", () => {
                ListView.hideDeletePopUp();
            });
        }

        // actions from the edit-pane-buttons
        const actionButtonsElement = document.querySelector(".action-buttons");
        if (actionButtonsElement) {
            actionButtonsElement.addEventListener("click", async (event) => {
                event.preventDefault();
                await this.handleEditPopupAction(event.target.dataset.actionCommand);
            });
        }

        // navigation events from the edit-pane
        const navItemButtonsElement = document.querySelector(".item-nav-buttons");
        if (navItemButtonsElement) {
            navItemButtonsElement.addEventListener("click", async (event) => {
                event.preventDefault();
                await this.handleEditPopupAction(event.target.dataset.actionCommand);
            });
        }

        // add keypress-listener for + to add a new note faster
        document.addEventListener("keypress", (ev) => {
            if (ev.key === "+" && !EditView.isEditPopUpVisible()) {
                this.createNewItem();
            }
        });

        // add keydown-listener for capturing special keys
        document.addEventListener("keydown", async (ev) => {
            // esc, cancel edit-window
            if (ev.key === "Escape" && EditView.isEditPopUpVisible()) {
                await this.handleEditPopupAction("cancelAndClose");
            }
            // ctrl+s save note
            if (ev.ctrlKey && ev.key === "s" && EditView.isEditPopUpVisible()) {
                await this.handleEditPopupAction("save");
                ev.preventDefault(); // prevent the browser of trying to save the page
            }
            // ctrl+shift+s save note and close edit-window
            if (ev.ctrlKey && ev.shiftKey && ev.key === "S" && EditView.isEditPopUpVisible()) {
                await this.handleEditPopupAction("saveAndClose");
                await this.refreshItemList();
            }
            // left arrow
            if (ev.ctrlKey && ev.key === "ArrowLeft" && EditView.isEditPopUpVisible()) {
                await this.handleEditPopupAction("prev");
                ev.preventDefault();
            }
            // right arrow
            if (ev.ctrlKey && ev.key === "ArrowRight" && EditView.isEditPopUpVisible()) {
                await this.handleEditPopupAction("next");
                ev.preventDefault();
            }
            // space, toggle show/hide completed filter
            if (ev.code === "Space" && !EditView.isEditPopUpVisible()) {
                this.currentHideCompleted = !this.currentHideCompleted;
                if (this.currentHideCompleted) {
                    document.querySelector(".show-completed-switch").removeAttribute("checked");
                } else {
                    document.querySelector(".show-completed-switch").setAttribute("checked", "true");
                }
                await this.refreshItemList();
            }
        });
    }

    async handleEditPopupAction(action) {
        switch (action) {
        case "save": {
            const saveRet = await this.saveItem();
            if (saveRet === "") {
                this.showItemEditPopUp(this.currentModifyingItem);
            } else {
                EditView.showValidityWarning(saveRet);
            }
            break;
        }
        case "saveAndClose": {
            const saveRet = await this.saveItem();
            if (saveRet === "") {
                EditView.hideEditPopUp();
                await this.refreshItemList();
            } else {
                EditView.showValidityWarning(saveRet);
            }
            break;
        }
        case "cancel":
            this.showItemEditPopUp(this.currentModifyingItem);
            break;
        case "cancelAndClose":
            EditView.hideEditPopUp();
            await this.refreshItemList();
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
                this.showItemEditPopUp(this.currentModifyingItem);
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
                this.showItemEditPopUp(this.currentModifyingItem);
            }
            break;
        }
        default:
            break;
        }
    }

    async setCompleteState(id, state) {
        const note = await noteService.getNoteById(id);
        note.isCompleted = state;
        await noteService.updateNote(note);
        await this.refreshItemList();
    }

    createNewItem() {
        const note = noteService.createNewNote();
        this.currentModifyingItem = note;
        EditView.showEditPopUp();
        this.showItemEditPopUp(note);
    }

    async editItem(id) {
        const note = await noteService.getNoteById(id);
        this.currentModifyingItem = note;
        EditView.showEditPopUp();
        this.showItemEditPopUp(note);
    }

    async deleteItem(id) {
        await noteService.deleteNote(id);
        // re-render list
        await this.refreshItemList();
    }

    async saveItem() {
        const formElement = EditView.getFormElement();
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
            this.currentModifyingItem.dueDate = new Date(dueDateElement.value).valueOf();
        }
        this.currentModifyingItem.modificationDate = new Date().valueOf();

        // check if it is a new note and add note or update store
        if (this.currentModifyingItem.id !== "") {
            this.currentModifyingItem = await noteService.updateNote(this.currentModifyingItem);
        } else {
            this.currentModifyingItem = await noteService.addNote(this.currentModifyingItem);
        }
        return "";
    }

    colorSelectorChange(newColorIndex) {
        this.currentModifyingItem.color = newColorIndex;
        EditView.setColorChooserValue(this.currentModifyingItem);
    }

    async showDeletePopUp(id) {
        this.currentModifyingItem = await noteService.getNoteById(id);
        ListView.displayDeletePopUp();
    }

    async refreshItemList() {
        const todos = await noteService.getNotes(
            this.currentSortAttribute,
            this.currentSortOrderAsc,
            this.currentHideCompleted,
        );

        ListView.renderItemList(todos);
    }

    showItemEditPopUp(todo) {
        EditView.renderItemEditPopUp(todo);

        // need to add event-listener for the color-chooser here, because it does not exist before
        // createEditPopUp is called
        const colorChooserElement = document.querySelector(".form-color-chooser");
        if (colorChooserElement) {
            colorChooserElement.addEventListener("change", (event) => {
                this.colorSelectorChange(event.target.selectedIndex);
            });
        }
    }
}

new NoteController().initialize();
