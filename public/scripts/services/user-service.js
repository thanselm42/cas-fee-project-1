import UserSettingsStorage from "./data/user-settings-storage-local.js";
import UserSettings from "./user-Settings.js";

export class UserService {
    constructor(storage) {
        this.storage = storage || new UserSettingsStorage();
        this.settings = new UserSettings("default");
        this.load();
    }

    load() {
        const tempSettings = this.storage.getSettings();
        this.settings = new UserSettings(tempSettings.userName,
            tempSettings.theme,
            tempSettings.lastNotification);
    }

    save(settings) {
        this.storage.update(settings);
    }

    getUserName() {
        return this.settings.userName;
    }

    getTheme() {
        return this.settings.theme;
    }

    getAutoTheme() {
        return this.settings.autoTheme;
    }

    getLastNotification() {
        return this.settings.lastNotification;
    }

    setUserName(userName) {
        this.settings.userName = userName;
        this.save(this.settings);
    }

    setTheme(theme) {
        this.settings.theme = theme;
        this.save(this.settings);
    }

    setAutoTheme(theme) {
        this.settings.autoTheme = theme;
        this.save(this.settings);
    }

    setLastNotification(ts) {
        this.settings.lastNotification = ts;
        this.save();
    }
}

export const userService = new UserService();
