const constTODOs = [
    {id: 1, title: "Einkaufen", description: "Tomaten, Zwiebeln, Knoblauch, Spaghetti, Parmesan", importance: 1, cDate: 1621797650000, dueDate: 1621962800000, color: 0, isCompleted: false},
    {id: 2, title: "Kochen", description: "Sauce kochen, danach Spaghetti", importance: 3, cDate: 1621797620000, dueDate: 1621962800000, color: 1, isCompleted: true},
    {id: 3, title: "Putzen", description: "Staubsaugen und Fensterputzen", importance: 2, cDate: 1621797680000, dueDate: 1621962800000, color: 4, isCompleted: true},
    {id: 4, title: "Schlafen", description: "...selbsterklärend...", importance: 5, cDate: 1621797600000, dueDate: -1, color: 3, isCompleted: false},
];

const currentItem = constTODOs[0];

function bubbledClickActionButtonsEventHandler(event) {
    console.log(event.target);
    event.preventDefault();
}

function bubbledClickItemNavigationButtonsEventHandler(event) {
    console.log(event.target);
    event.preventDefault();
}

function renderFillForm(noteItem){
}

function attachEventListeners() {
    const actionButtonsElement = document.querySelector(".action-buttons");
    if (actionButtonsElement) {
        actionButtonsElement.addEventListener("click", bubbledClickActionButtonsEventHandler);
    }

    const navItemButtonsElement = document.querySelector(".item-nav-buttons");
    if (navItemButtonsElement) {
        navItemButtonsElement.addEventListener("click", bubbledClickItemNavigationButtonsEventHandler);
    }
}

attachEventListeners();
renderFillForm(currentItem);
