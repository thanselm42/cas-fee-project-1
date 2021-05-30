import {getDateAsISOString} from "../utils.js";
import createAdditionalItemInfoString from "./common.js";

function createColorChooser(todo) {
    let ret = "<select id=\"colorlabelchooser\" class=\"form-input-very-small form-color-chooser\" name=\"colorlabel\">";

    for (let i = 0; i < 5; i++) {
        ret += `    <option class="color-chooser-color-${i}" value="${i}"`;
        if (todo.color === i) {
            ret += " selected";
        }
        ret += "></option>";
    }
    ret += "</select>";
    return ret;
}

export default function createEditPopUp(todo) {
    return `
      <div class="form-item-wrapper">
        <input id="title" class="form-input title-field" type="text" name="title" placeholder="Enter a meaningful title" value="${todo.title}" required>
        <label class="form-label" for="title">Title</label>
      </div>
      <div class="form-item-wrapper">
        <textarea id="description" class="form-input description-field" name="description" placeholder="Enter a detailed description">${todo.description}</textarea>
        <label class="form-label" for="description">Description</label>
      </div>
      <div class="form-item-wrapper">
        <input id="importance" class="form-input-very-small importance-field" type="number" name="importance" value="${todo.importance}" required min="1" max="5">
        <label class="form-label" for="importance">Importance</label>        
      </div>
      <div class="form-item-wrapper">
        ${createColorChooser(todo)}
        <label class="form-label" for="colorlabelchooser">Color</label>
      </div>
      <div class="form-item-wrapper">
        <input id="duedate" class="form-input-small duedate-field" type="datetime-local" name="duedate" placeholder="" value="${getDateAsISOString(todo.dueDate)}">
        <label class="form-label" for="duedate">Due Date</label>
      </div>
      <div class="form-item-wrapper">
        <p class="item-detail-infos">${createAdditionalItemInfoString(todo)}</p>
      </div>
        `;
}
