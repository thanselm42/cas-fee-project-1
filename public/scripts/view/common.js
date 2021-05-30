import {getHumanReadableDate} from "../utils.js";

export default function createAdditionalItemInfoString(todo) {
    return `ID: ${todo.id}; creation date: ${getHumanReadableDate(todo.creationDate)}; 
    last modified: ${getHumanReadableDate(todo.modificationDate)}; 
    completed: ${todo.isCompleted}`;
}
