export default class Note {
    constructor(id, title, description, importance,
        creationDate, dueDate, modificationDate, color, isCompleted) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.importance = importance;
        this.creationDate = creationDate;
        this.dueDate = dueDate;
        this.modificationDate = modificationDate;
        this.color = color;
        this.isCompleted = isCompleted;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            importance: this.importance,
            creationDate: this.creationDate,
            dueDate: this.dueDate,
            modificationDate: this.modificationDate,
            color: this.color,
            isCompleted: this.isCompleted
        };
    }
}
