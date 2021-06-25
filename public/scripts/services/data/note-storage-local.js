import Note from "../note.js";

export default class NoteStorage {
    constructor() {
        this.localStorageKey = "ToDoStorage_Notes_xxx_v1";
        const notes = JSON.parse(localStorage.getItem(this.localStorageKey) || "[ ]");
        this.notes = notes.map((n) => NoteStorage.createNote(n));
        localStorage.setItem(this.localStorageKey, JSON.stringify(notes));
    }

    async getAll() {
        return this.notes;
    }

    async add(note) {
        this.notes.push(note);
        this.save();
    }

    async delete(id) {
        for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].id === id) {
                this.notes.splice(i, 1);
                break;
            }
        }
        this.save();
    }

    async update(note) {
        let isItANewNote = true;
        this.notes.forEach((value, index) => {
            if (note.id === value.id) {
                this.notes[index] = note;
                isItANewNote = false;
            }
        });

        if (isItANewNote) {
            await this.add(note);
        } else {
            this.save();
        }
    }

    async getByID(id) {
        return this.notes.filter((n) => n.id === id)[0];
    }

    save() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.notes));
    }

    getNewID() {
        let highestID = 0;
        for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].id > highestID) {
                highestID = this.notes[i].id;
            }
        }
        ++highestID;
        return highestID.toString();
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
            n.id,
        );
    }

    static getStorageName() {
        return "local";
    }
}
