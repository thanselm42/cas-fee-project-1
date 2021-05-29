import getHumanReadableDate from "../utils.js";
import createAdditionalItemInfoString from "./common.js";

function createColorChooser(todo) {
    let ret = "<select id=\"colorlabelchooser\" class=\"form-input-very-small form-color-chooser\" name=\"colorlabel\" required>";

    for (let i = 0; i < 5; i++) {
        ret += `    <option class="list-entry-color-${i}" value="${i}"`;
        if (todo.color === i) {
            ret += " selected";
        }
        ret += "></option>";
    }
    ret += "</select>";
    return ret;
}

function createRatingStars(todo) {
    let ret = "";
    for (let i = 5; i > 0; i--) {
        ret += `    <input type="radio" id="star${i}" name="importance" value="${i}"`;
        if (todo.importance === i) {
            ret += " checked";
        }
        ret += "></input>";
        ret += `<label for="star${i}" title="${i}"></label>`;
    }
    return ret;
}

export default function createEditPopUp(todo) {
    return `
        <div class="form-item-wrapper">
        <label class="form-label" for="title">Title</label>
        <input id="title" class="form-input title-field" type="text" name="title" placeholder="Enter a meaningful title" value="${todo.title}" required>
      </div>
      <div class="form-item-wrapper">
        <label class="form-label" for="description">Description</label>
        <textarea id="description" class="form-input description-field" name="description" placeholder="Enter a detailed description">${todo.description}</textarea>
      </div>
      <div class="form-item-wrapper">
        <label class="form-label" for="importance">Importance</label>
        <input id="importance" class="form-input-small importance-field" type="number" name="importance" value="${todo.importance}" required>
      </div>
      <div class="form-item-wrapper">
        <label class="form-label" for="colorlabelchooser">Color</label>
        ${createColorChooser(todo)}
        <!--                <input id="colorlabel" class="form-input-small color-field" type="text" name="color" placeholder="none"> -->
      </div>
      <div class="form-item-wrapper">
        <label class="form-label" for="duedate">Due Date</label>
        <input id="duedate" class="form-input-small duedate-field" type="datetime-local" name="duedate" placeholder="" value="${getHumanReadableDate(todo.dueDate)}">
      </div>
      <div class ="form-item-wrapper">
        <fieldset class="rating">
          <legend>Please rate:</legend>
         ${createRatingStars(todo)}
        </fieldset>
      </div>
      <div class="form-item-wrapper">
        <p class="item-detail-infos">${createAdditionalItemInfoString(todo)}</p>
      </div>
        `;
}
