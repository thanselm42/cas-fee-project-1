import {NoteService, noteService} from "../services/note-service.js";
import renderStats from "../view/stats.js";

class AboutController {
    static async initialize() {
        await renderStats(
            await noteService.getAllNotesCount(),
            await noteService.getCompletedNotesCount(),
            await noteService.getOpenNotesCount(),
            await NoteService.getStorageName(),
        );
    }
}

AboutController.initialize();
