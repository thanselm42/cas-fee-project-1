import {noteStorage} from "../services/noteStorage.js";

export class NotesController {
    // eslint-disable-next-line class-methods-use-this
    async getNotes(req, res) {
        res.json(await noteStorage.getAll() || []);
    }

    // eslint-disable-next-line class-methods-use-this
    async createNote(req, res) {
        res.json(await noteStorage.add(req.body));
    }

    // eslint-disable-next-line class-methods-use-this
    async updateNote(req, res) {
        res.json(await noteStorage.update(req.body, req.params.id));
    }

    // eslint-disable-next-line class-methods-use-this
    async getNoteByID(req, res) {
        res.json(await noteStorage.getByID(req.params.id));
    }

    // eslint-disable-next-line class-methods-use-this
    async deleteNote(req, res) {
        res.json(await noteStorage.delete(req.params.id));
    }
}

export const notesController = new NotesController();
