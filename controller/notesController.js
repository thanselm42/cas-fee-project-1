import {noteStorage} from "../services/noteStorage.js";

export class NotesController {
    async getNotes(req, res) {
        res.json(await noteStorage.getAll() || []);
    }

    async createNote(req, res) {
        res.json(await noteStorage.add(req.body));
    }

    async updateNote(req, res) {
        res.json(await noteStorage.update(req.body, req.params.id));
    }

    async getNoteByID(req, res) {
        res.json(await noteStorage.getByID(req.params.id));
    }

    async deleteNote(req, res) {
        res.json(await noteStorage.delete(req.params.id));
    }
}

export const notesController = new NotesController();
