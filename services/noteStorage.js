import Datastore from "nedb-promise";
import Note from "../public/scripts/services/note.js";

export class NoteStorage {
    constructor(db) {
        this.db = db || new Datastore({filename: "./data/notes.db", autoload: true});
    }

    async add(note) {
        const emptyNote = NoteStorage.constructNote(note);
        return this.db.insert(emptyNote);
    }

    async update(note, id) {
        const emptyNote = NoteStorage.constructNote(note);
        // need to delete _id otherwise the DB will have a problem.
        // eslint-disable-next-line no-underscore-dangle
        delete emptyNote._id;
        await this.db.update({_id: id}, {$set: emptyNote});
        const ret = await this.getByID(id);
        return ret;
    }

    async delete(id) {
        await this.db.update({_id: id}, {$set: {state: "DELETED"}});
        return this.getByID(id);
    }

    async getByID(id) {
        const note = await this.db.findOne({_id: id});

        if (note && !note.state) {
            return note;
        }
        return null;
    }

    async getAll() {
        const ret = await this.db.cfind().sort({ creationDate: -1 }).exec();
        return ret.filter((n) => !n.state);
    }

    static constructNote(n) {
        return new Note(
            n.title,
            n.description,
            n.importance,
            n.creationDate,
            n.dueDate,
            n.modificationDate,
            n.color,
            n.isCompleted,
            n.id,
        );
    }
}

export const noteStorage = new NoteStorage();
