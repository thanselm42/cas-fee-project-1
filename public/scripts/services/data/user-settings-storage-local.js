export default class UserSettingsStorage {
    constructor() {
        this.userSettigns = JSON.parse(localStorage.getItem("ToDoStorage_user_xxx_v1"));
    }

    getSettings() {
        return this.userSettigns;
    }

    update(settings) {
        this.userSettigns = settings;
        localStorage.setItem("ToDoStorage_user_xxx_v1", JSON.stringify(this.userSettigns));
    }
}
