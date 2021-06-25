import express from "express";
import {notesController} from "../controller/notesController.js";

const router = express.Router();

router.get("/", notesController.getNotes.bind(notesController));
router.post("/", notesController.createNote.bind(notesController));
router.post("/:id/", notesController.updateNote.bind(notesController));
router.get("/:id/", notesController.getNoteByID.bind(notesController));
router.delete("/:id/", notesController.deleteNote.bind(notesController));

export const noteRoutes = router;
