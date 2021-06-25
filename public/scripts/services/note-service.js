// if you like to run a local demo-version use a local quote-storage
// import NoteStorage from "./data/note-storage-local.js";
import NoteStorage from "./data/note-storage-remote.js";
import Note from "./note.js";
import {sortItemsBy, filterCompleted} from "./sort-util.js";

export class NoteService {
    constructor() {
        this.storage = new NoteStorage();
    }

    async getAllNotes() {
        return this.storage.getAll();
    }

    async getNotes(orderBy, orderAscending, hideCompleted) {
        const notes = await this.getAllNotes();
        if (notes.length > 0) {
            return filterCompleted(sortItemsBy(notes, orderBy, orderAscending), hideCompleted);
        }
        return [];
    }

    async getAllOpenNotesUnSorted() {
        const notes = await this.getAllNotes();

        if (notes.length > 0) {
            return filterCompleted(notes, true);
        }
        return [];
    }

    async addNote(note) {
        return this.storage.add(note);
    }

    async deleteNote(id) {
        await this.storage.delete(id);
    }

    async updateNote(note) {
        return this.storage.update(note);
    }

    async getNoteById(id) {
        return this.storage.getByID(id);
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
            this.storage.getNewID(),
        );
    }

    async getAllNotesCount() {
        const notes = await this.getAllNotes();
        return notes.length;
    }

    async getOpenNotesCount() {
        const notes = await this.getAllOpenNotesUnSorted();
        return notes.length;
    }

    async getCompletedNotesCount() {
        const openNotes = await this.getAllOpenNotesUnSorted();
        const allNotes = await this.getAllNotes();

        return allNotes.length - openNotes.length;
    }

    static getStorageName() {
        return NoteStorage.getStorageName();
    }
}
export const noteService = new NoteService();
