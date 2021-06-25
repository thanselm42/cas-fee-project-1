export default class UserSettings {
    constructor(userName, theme, autoTheme, showNotifications, lastNotification) {
        this.userName = userName;
        this.theme = theme;
        this.autoTheme = autoTheme;
        this.showNotifications = showNotifications;
        this.lastNotification = lastNotification;
    }
}
