export default class NoteStorageMock {
    constructor() {
        const notes = JSON.parse(localStorage.getItem("ToDoStorage_hato_v1") || "[ ]");
        this.notes = notes;
        localStorage.setItem("ToDoStorage_hato_v1", JSON.stringify(notes));
    }

    getAll() {
        return this.notes;
    }

    update(notes) {
        this.notes = notes;
        localStorage.setItem("ToDoStorage_hato_v1", JSON.stringify(this.notes));
    }

    getName() {
        return "local";
    }
}
