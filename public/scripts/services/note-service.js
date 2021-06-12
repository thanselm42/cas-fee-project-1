import Note from "./note.js";
import {sortItemsBy, filterCompleted} from "./sort-util.js";
import {httpService} from "./http-service.js";

export class NoteService {
    constructor() {
        this.apiURL = "/api/v1/notes/";
    }

    async getRemoteNotes() {
        const notes = await httpService.ajax("GET", this.apiURL, undefined);
        return notes.map((n) => new Note(
            n.title,
            n.description,
            n.importance,
            n.creationDate,
            n.dueDate,
            n.modificationDate,
            n.color,
            n.isCompleted,
            n._id,
        ));
    }

    async getNotes(orderBy, orderAscending, hideCompleted) {
        const notes = await this.getRemoteNotes();
        if (notes.length > 0) {
            return filterCompleted(sortItemsBy(notes, orderBy, orderAscending), hideCompleted);
        }
        return [];
    }

    async getAllOpenNotesUnSorted() {
        const notes = await this.getRemoteNotes();

        if (notes.length > 0) {
            return filterCompleted(notes, true);
        }
        return [];
    }

    async addNote(note) {
        return httpService.ajax("POST", this.apiURL, note.toJSON());
    }

    async deleteNote(id) {
        return httpService.ajax("DELETE", `${this.apiURL}${id}`, undefined);
    }

    async updateNote(note) {
        return httpService.ajax("POST", `${this.apiURL}${note.id}`, note.toJSON());
    }

    async getNoteById(id) {
        const n = await httpService.ajax("GET", `${this.apiURL}${id}`, undefined);
        return new Note(
            n.title,
            n.description,
            n.importance,
            n.creationDate,
            n.dueDate,
            n.modificationDate,
            n.color,
            n.isCompleted,
            n._id);
    }

    async getNextNoteById(id, sort, asc, completed) {
        let ret = null;
        const tempNotes = await this.getNotes(sort, asc, completed);
        tempNotes.forEach((value, index) => {
            if (value.id === id) {
                if (index < tempNotes.length - 1) {
                    ret = tempNotes[index + 1];
                }
            }
        });
        return ret;
    }

    async getPreviousNoteById(id, sort, asc, hideCompleted) {
        let ret = null;
        const tempNotes = await this.getNotes(sort, asc, hideCompleted);
        tempNotes.forEach((value, index) => {
            if (value.id === id) {
                if (index > 0) {
                    ret = tempNotes[index - 1];
                }
            }
        });
        return ret;
    }

    createNewNote() {
        return new Note(
            "",
            "",
            2,
            new Date().valueOf(),
            -1,
            -1,
            0,
            false,
            "",
        );
    }

    async getAllNotesCount() {
        const notes = await this.getRemoteNotes();
        return notes.length;
    }

    async getOpenNotesCount() {
        const notes = await this.getAllOpenNotesUnSorted();
        return notes.length;
    }

    async getCompletedNotesCount() {
        const openNotes = await this.getAllOpenNotesUnSorted();
        const allNotes = await this.getRemoteNotes();

        return allNotes.length - openNotes.length;
    }

    getStorageName() {
        return "nedb";
    }
}
export const noteService = new NoteService();
