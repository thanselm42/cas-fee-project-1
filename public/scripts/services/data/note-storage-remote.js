import {httpService} from "../util/http-service.js";
import Note from "../note.js";

export default class NoteStorage {
    constructor() {
        this.apiURL = "/api/v1/notes/";
    }

    async getAll() {
        const notes = await httpService.ajax("GET", this.apiURL, undefined);
        return notes.map((n) => NoteStorage.createNote(n));
    }

    async add(note) {
        const n = await httpService.ajax("POST", this.apiURL, note.toJSON());
        return NoteStorage.createNote(n);
    }

    async delete(id) {
        await httpService.ajax("DELETE", `${this.apiURL}${id}`, undefined);
    }

    async update(note) {
        const n = await httpService.ajax("POST", `${this.apiURL}${note.id}`, note.toJSON());
        return NoteStorage.createNote(n);
    }

    async getByID(id) {
        const n = await httpService.ajax("GET", `${this.apiURL}${id}`, undefined);
        return NoteStorage.createNote(n);
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

    // eslint-disable-next-line class-methods-use-this
    getNewID() {
        return "";
    }

    static getStorageName() {
        return "nedb";
    }
}
