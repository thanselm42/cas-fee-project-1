/**
 */
export default class NoteStorage {
    constructor() {
        const notes = [
            {id: 1, title: "Einkaufen", description: "Tomaten, Zwiebeln, Knoblauch, Spaghetti, Parmesan", importance: 1, creationDate: 1621797650000, dueDate: 1621962800000, modificationDate: 10, color: 0, isCompleted: false},
            {id: 2, title: "Kochen", description: "Sauce kochen, danach Spaghetti", importance: 3, creationDate: 1621797620000, dueDate: 1621962800000, modificationDate: 10, color: 1, isCompleted: true},
            {id: 3, title: "Putzen", description: "Staubsaugen und Fensterputzen", importance: 2, creationDate: 1621797680000, dueDate: 1621962800000, modificationDate: 10, color: 4, isCompleted: true},
            {id: 4, title: "Schlafen", description: "...selbsterklärend...", importance: 5, creationDate: 1621797600000, dueDate: -1, modificationDate: 10, color: 3, isCompleted: false},
        ];
        this.notes = notes;
        this.name = "static local";
    }

    getAll() {
        return this.notes;
    }

    update(notes) {
        this.notes = notes;
    }

    getName() {
        return this.name;
    }
}
