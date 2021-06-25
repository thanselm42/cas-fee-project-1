import {quoteService} from "../services/quotes-service.js";
import {userService} from "../services/user-service.js";
import createQuote from "../view/quote.js";

export default class MainController {
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
        await this.initEventHandlers();
        this.initThemes();
        await quoteService.load();
        this.renderQuote();
    }

    initEventHandlers() {
        // Theme change
        const themeChangeButton = document.querySelector(".theme-changer");
        themeChangeButton.addEventListener("change", (event) => {
            const newTheme = this.themes[event.target.selectedIndex];
            this.changeTheme(newTheme, false);
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

        this.changeTheme(userService.getTheme(), true);
    }

    changeTheme(newTheme, isInitCall) {
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

    renderQuote() {
        const quote = quoteService.getRandomQuote();
        const asideElement = document.querySelector(".aside-quote-wrapper");
        asideElement.innerHTML = createQuote(quote);
    }
}

new MainController().initialize();
