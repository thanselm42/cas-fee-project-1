import NoteStorageMock from "./data/note-storage-local.js";
import Note from "./note.js";
import {sortItemsBy, filterCompleted} from "./sort-util.js";

export class NoteService {
    constructor(storage) {
        this.storage = storage || new NoteStorageMock();
        this.notes = [];
    }

    load() {
        this.notes = this.storage.getAll().map((n) => new Note(n.id,
            n.title,
            n.description,
            n.importance,
            n.creationDate,
            n.dueDate,
            n.modificationDate,
            n.color,
            n.isCompleted));
    }

    save() {
        this.storage.update(this.notes.map((n) => n.toJSON()));
    }

    getNotes(orderBy, orderAscending, filterBy) {
        if (this.notes.length > 0) {
            return filterCompleted(sortItemsBy(this.notes, orderBy, orderAscending), filterBy);
        }
        return [];
    }

    addNote(note) {
        this.notes.push(note);
        this.save();
    }

    deleteNote(id) {
        let nbrID;
        if (typeof (id) !== "number") {
            nbrID = Number(id);
        } else {
            nbrID = id;
        }

        for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].id === nbrID) {
                this.notes.splice(i, 1);
                break;
            }
        }
        this.save();
    }

    updateNote(note) {
        let isItANewNote = true;
        this.notes.forEach((value, index) => {
            if (note.id === value.id) {
                this.notes[index] = note;
                isItANewNote = false;
            }
        });

        if (isItANewNote) {
            this.addNote(note);
        } else {
            this.save();
        }
    }

    getNoteById(id) {
        let nbrID;
        if (typeof (id) !== "number") {
            nbrID = Number(id);
        }
        return this.notes.filter((n) => n.id === nbrID)[0];
    }

    getNextNoteById(id, sort, asc, completed) {
        let ret = null;
        const tempNotes = this.getNotes(sort, asc, completed);
        tempNotes.forEach((value, index) => {
            if (value.id === id) {
                if (index < tempNotes.length - 1) {
                    ret = tempNotes[index + 1];
                }
            }
        });
        return ret;
    }

    getPreviousNoteById(id, sort, asc, completed) {
        let ret = null;
        const tempNotes = this.getNotes(sort, asc, completed);
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
            this.generateNewID(),
            "",
            "",
            2,
            new Date().valueOf(),
            -1,
            -1,
            0,
            false,
        );
    }

    generateNewID() {
        let highestID = 0;
        for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].id > highestID) {
                highestID = this.notes[i].id;
            }
        }
        return ++highestID;
    }

    getAllNotesCount() {
        return this.notes.length;
    }

    getOpenNotesCount() {
        return this.notes.filter((value) => value.isCompleted === false).length;
    }

    getCompletedNotesCount() {
        return this.notes.filter((value) => value.isCompleted === true).length;
    }

    getStorageName() {
        return this.storage.getName();
    }
}
export const noteService = new NoteService();
