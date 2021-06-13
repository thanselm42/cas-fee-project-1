export default class UserSettings {
    constructor(userName, theme, currentTheme, lastNotification) {
        this.userName = userName;
        this.theme = theme;
        this.autoTheme = currentTheme;
        this.lastNotification = lastNotification;
    }
}
