import express from "express";
import {notesController} from "../controller/notesController.js";

const noteRoutes = express.Router();

noteRoutes.get("/", notesController.getNotes.bind(notesController));
noteRoutes.post("/", notesController.createNote.bind(notesController));
noteRoutes.post("/:id/", notesController.updateNote.bind(notesController));
noteRoutes.get("/:id/", notesController.getNoteByID.bind(notesController));
noteRoutes.delete("/:id/", notesController.deleteNote.bind(notesController));

export default noteRoutes;
