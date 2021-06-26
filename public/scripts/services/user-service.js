import UserSettingsStorage from "./data/user-settings-storage-local.js";
import UserSettings from "./user-settings.js";

export class UserService {
    constructor(storage) {
        this.storage = storage || new UserSettingsStorage();
        this.load();
    }

    load() {
        const tempSettings = this.storage.getSettings();

        if (tempSettings) {
            this.settings = new UserSettings(tempSettings.userName,
                tempSettings.theme,
                tempSettings.autoTheme,
                tempSettings.showNotifications,
                tempSettings.lastNotification);
        } else {
            this.settings = new UserSettings("default", "auto", "", true, 0);
            this.save(this.settings);
        }
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

    getShowNotifications() {
        return this.settings.showNotifications;
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

    setShowNotifications(show) {
        this.settings.showNotifications = show;
        this.save(this.settings);
    }

    setLastNotification(ts) {
        this.settings.lastNotification = ts;
        this.save(this.settings);
    }
}

export const userService = new UserService();
