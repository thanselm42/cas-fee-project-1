import {NoteService, noteService} from '../services/note-service.js';
import createStats from "../view/stats.js";

export default class AboutController {
    async initialize() {
        await this.renderStats();
    }

    async renderStats() {
        const statsElement = document.querySelector(".stats");
        if (statsElement) {
            statsElement.innerHTML = createStats(await noteService.getAllNotesCount(),
                await noteService.getCompletedNotesCount(),
                await noteService.getOpenNotesCount(),
                await NoteService.getStorageName());
        }
    }
}

new AboutController().initialize();
