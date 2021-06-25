import Note from "./note.js";
import {sortItemsBy, filterCompleted} from "./sort-util.js";
import {httpService} from "./util/http-service.js";

export class NoteService {
    constructor() {
        this.apiURL = "/api/v1/notes/";
    }

    async getRemoteNotes() {
        const notes = await httpService.ajax("GET", this.apiURL, undefined);
        return notes.map((n) => NoteService.createNote(n));
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
        const n = await httpService.ajax("POST", this.apiURL, note.toJSON());
        return NoteService.createNote(n);
    }

    async deleteNote(id) {
        const n = await httpService.ajax("DELETE", `${this.apiURL}${id}`, undefined);
        return NoteService.createNote(n);
    }

    async updateNote(note) {
        const n = await httpService.ajax("POST", `${this.apiURL}${note.id}`, note.toJSON());
        return NoteService.createNote(n);
    }

    async getNoteById(id) {
        const n = await httpService.ajax("GET", `${this.apiURL}${id}`, undefined);
        return NoteService.createNote(n);
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

    static createNewNote() {
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

    static createNote(n) {
        return new Note(
            n.title,
            n.description,
            n.importance,
            n.creationDate,
            n.dueDate,
            n.modificationDate,
            n.color,
            n.isCompleted,
            // eslint-disable-next-line no-underscore-dangle
            n._id,
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

    static getStorageName() {
        return "nedb";
    }
}
export const noteService = new NoteService();
