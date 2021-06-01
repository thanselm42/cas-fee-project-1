import createAdditionalItemInfoString from "./common.js";
import {getHumanReadableDate} from "../utils.js";

function createImportanceElement(importance) {
    let ret = "";

    for (let i = 1; i < 6; i++) {
        ret += "<span class=\"rating-star\"";
        if (i <= importance) {
            ret += ` data-rating="${importance}">&#9733;`;
        } else {
            ret += ">&#9734;";
        }
        ret += "</span>";
    }
    return ret;
}

function getIsCompletedElement(isCompleted) {
    if (isCompleted) { return "checked"; }
    return "";
}

function createListItem(todo) {
    return `
    <li>
        <div class="list-entry-container list-entry-color-${todo.color}" data-item-id="${todo.id}">
            <div class="list-entry-main">
                <p class="list-entry-title">${todo.title}</p>
                <p class="list-entry-importance">${createImportanceElement(todo.importance)}</p>
                <p class="list-entry-due-date">${getHumanReadableDate(todo.dueDate)}</p>
                <textarea class="list-entry-description" readOnly="">${todo.description}</textarea>
                <p class="item-detail-infos">${createAdditionalItemInfoString(todo)}</p>
            </div>
            <div class="list-entry-buttons">
                <input class="list-entry-btn" type="checkbox"
                       name="todos_list_entry_is_completed"
                       data-edit-entry="complete" ${getIsCompletedElement(todo.isCompleted)}
                       data-item-id="${todo.id}">
                <button class="list-entry-btn action-button" data-edit-entry="modify" data-item-id="${todo.id}" type="button">&#9998
                </button>
                <button class="list-entry-btn action-button" data-edit-entry="delete" data-item-id="${todo.id}" type="button">&#128465
                </button>
            </div>
        </div>
    </li>`;
}

export default function createListItems(todoList) {
    return todoList.map((value) => createListItem(value)).join("");
}
