import UserSettings from "../user-Settings.js";

export default class UserSettingsStorage {
    constructor() {
        const settings = JSON.parse(localStorage.getItem("ToDoStorage_user_xxx_v1"));
        this.userSettigns = settings;
    }

    getSettings() {
        return this.userSettigns;
    }

    update(settings) {
        this.userSettigns = settings;
        localStorage.setItem("ToDoStorage_user_xxx_v1", JSON.stringify(this.userSettigns));
    }
}
