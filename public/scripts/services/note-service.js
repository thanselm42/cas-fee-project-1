import NoteStorage from "./data/note-storage.js";
import Note from "./note.js";
import {sortItemsBy, filterCompleted} from "./sort-util.js";

export class NoteService {
    constructor(storage) {
        this.storage = storage || new NoteStorage();
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
        console.log(orderBy);
        if (this.notes.length > 0) {
            return filterCompleted(sortItemsBy(this.notes, orderBy, orderAscending), filterBy);
        }
        return [];
    }

    addNote(note) {
        this.notes.push(note);
        this.save();
    }

    updateNote(note) {
        this.notes.forEach((value, index) => {
            if (note.id === value.id) {
                this.notes[index] = note;
            }
        });
        this.save();
    }

    getNoteById(id) {
        return this.notes.filter((n) => n.id === id);
    }

    createNewNote() {
        return new Note(
            this.notes.length + 1,
            "",
            "",
            1,
            new Date().valueOf(),
            -1,
            -1,
            0,
            false,
        );
    }
}
export const noteService = new NoteService();
