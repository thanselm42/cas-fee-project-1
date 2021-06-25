import {quoteService} from "../services/quotes-service.js";
import {userService} from "../services/user-service.js";
import createQuote from "../view/quote.js";
import {noteService} from "../services/note-service.js";
import {getAsideContent, getHeaderContent, getPageFooter} from "../view/common.js";

class MainController {
    constructor() {
        this.themes = [
            "auto",
            "light-theme",
            "dark-theme",
            "neon-theme",
            "rainbow-theme",
        ];
    }

    async initialize() {
        await quoteService.load();
        MainController.renderHeader();
        MainController.renderNotificationButton();
        MainController.renderAside();
        MainController.renderQuote();
        MainController.renderFooter();
        this.initThemes();
        await this.initEventHandlers();
        await this.initNotification();
    }

    initEventHandlers() {
        // Notification switcher
        const notificationSwitch = document.querySelector(".alarm-button");
        notificationSwitch.addEventListener("click", () => {
            MainController.enableDisableNotification();
        });
        // Theme change
        const themeChangeButton = document.querySelector(".theme-changer");
        themeChangeButton.addEventListener("change", (event) => {
            const newTheme = this.themes[event.target.selectedIndex];
            MainController.changeTheme(newTheme, false);
        });
    }

    initThemes() {
        // get system color-scheme
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        // if the system is set to dark-mode, use dark-mode as well
        if (prefersDarkScheme.matches) {
            userService.setAutoTheme(this.themes[2]);
        } else {
            userService.setAutoTheme(this.themes[1]);
        }
        // select appropriate theme
        document.querySelector(`.theme-changer option[value="${userService.getTheme()}"]`)
            .setAttribute("selected", "true");

        MainController.changeTheme(userService.getTheme(), true);
    }

    async initNotification() {
        this.notificationPermission = Notification.permission;
        if (this.notificationPermission !== "granted") {
            this.notificationPermission = await Notification.requestPermission();
        }
        this.workerThread = new Worker("./scripts/controllers/note-timer.js");
        this.workerThread.onmessage = (ev) => this.notificationCheck(ev);
        await this.notificationCheck();
    }

    async notificationCheck() {
        if (userService.getShowNotifications()) {
            const now = new Date();
            const notes = await noteService.getAllOpenNotesUnSorted();

            // check for notes where the due-date will expire in the next 60 minutes
            const filteredNotes = notes.filter((value) => value.dueDate > 0
                && (value.dueDate <= now.valueOf() + (1000 * 60 * 60)));

            if (filteredNotes.length > 0) {
                // prevent showing notifications to often (max every 10min)
                if (userService.getLastNotification() + (1000 * 60 * 10) < now.valueOf()) {
                    userService.setLastNotification(now.valueOf());
                    this.showNotification(filteredNotes);
                }
            }
        }
    }

    showNotification(ids) {
        let notificationMessage;
        if (Array.isArray(ids) && ids.length > 1) {
            notificationMessage = "There are several uncompleted TODOs that have reached the due-date or will reach the due-date soon!";
        } else {
            notificationMessage = `The Due-Date for ${ids[0].title} has already been reached or will be reached soon`;
        }

        if (this.notificationPermission === "granted") {
            this.greeting = new Notification(notificationMessage);
        }
    }

    static changeTheme(newTheme, isInitCall) {
        if (userService.getTheme() === "auto") {
            if (userService.getAutoTheme() !== "light-theme" && !isInitCall) {
                document.body.classList.toggle(userService.getAutoTheme());
            }
            if (newTheme !== "light-theme") {
                if (newTheme !== "auto") {
                    document.body.classList.toggle(newTheme);
                } else {
                    document.body.classList.toggle(userService.getAutoTheme());
                }
            }
        } else {
            if (userService.getTheme() !== "light-theme" && !isInitCall) {
                document.body.classList.toggle(userService.getTheme());
            }
            if (newTheme !== "light-theme") {
                if (newTheme !== "auto") {
                    document.body.classList.toggle(newTheme);
                } else {
                    document.body.classList.toggle(userService.getAutoTheme());
                }
            }
        }
        userService.setTheme(newTheme);
    }

    static enableDisableNotification() {
        userService.setShowNotifications(!userService.getShowNotifications());
        MainController.renderNotificationButton();
    }

    static renderHeader() {
        const headerElement = document.querySelector(".page-header");
        headerElement.innerHTML = getHeaderContent(headerElement.dataset.currentPage);
    }

    static renderNotificationButton() {
        const notificationSwitch = document.querySelector(".alarm-button");
        if (userService.getShowNotifications()) {
            notificationSwitch.dataset.isSelected = "true";
        } else {
            notificationSwitch.dataset.isSelected = "false";
        }
    }

    static renderAside() {
        const asideElement = document.querySelector(".main-aside");
        asideElement.innerHTML = getAsideContent();
    }

    static renderQuote() {
        const quote = quoteService.getRandomQuote();
        const asideElement = document.querySelector(".aside-quote-wrapper");
        asideElement.innerHTML = createQuote(quote);
    }

    static renderFooter() {
        const footerElement = document.querySelector(".page-footer");
        footerElement.innerHTML = getPageFooter();
    }
}

new MainController().initialize();
