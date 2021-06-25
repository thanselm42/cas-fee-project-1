export default class UserSettingsStorage {
    constructor() {
        this.localStorageKey = "ToDoStorage_user_xxx_v1";
        this.userSettigns = JSON.parse(localStorage.getItem(this.localStorageKey));
    }

    getSettings() {
        return this.userSettigns;
    }

    update(settings) {
        this.userSettigns = settings;
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.userSettigns));
    }
}
