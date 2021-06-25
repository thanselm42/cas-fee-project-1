import {NoteService, noteService} from "../services/note-service.js";
import createStats from "../view/stats.js";

class AboutController {
    static async initialize() {
        await AboutController.renderStats();
    }

    static async renderStats() {
        const statsElement = document.querySelector(".stats");
        if (statsElement) {
            statsElement.innerHTML = createStats(await noteService.getAllNotesCount(),
                await noteService.getCompletedNotesCount(),
                await noteService.getOpenNotesCount(),
                await NoteService.getStorageName());
        }
    }
}

AboutController.initialize();
