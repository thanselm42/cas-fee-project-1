import {getLocalDateTimeAsISOString} from "../utils.js";
import {createAdditionalItemInfoString} from "./common.js";

export default class EditView {
    static createColorChooser(todo) {
        let ret;
        ret = `<select id="colorlabelchooser" class="color-chooser-color-${todo.color} form-input-very-small form-color-chooser" name="colorlabel">`;

        for (let i = 0; i < 5; i++) {
            ret += `    <option class="color-chooser-color-${i}" value="${i}"`;
            if (todo.color === i) {
                ret += " selected";
            }
            ret += "></option>";
        }
        ret += "</select>";
        ret += "<label class=\"form-label\" for=\"colorlabelchooser\">Color</label>";
        return ret;
    }

    static addCheckedForImportanceRadioInputField(todo, pos) {
        if (todo.importance === pos) {
            return " checked";
        }
        return "";
    }

    static createEditPopUp(todo) {
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
        <div class="form-input-small nobackground">
            <fieldset id="importance" class="rating importance-field">
                <input type="radio" id="star5" name="rating" value="5" ${EditView.addCheckedForImportanceRadioInputField(todo, 5)}><label class = "full" for="star5" title="5"></label>
                <input type="radio" id="star4" name="rating" value="4" ${EditView.addCheckedForImportanceRadioInputField(todo, 4)}><label class = "full" for="star4" title="4"></label>
                <input type="radio" id="star3" name="rating" value="3" ${EditView.addCheckedForImportanceRadioInputField(todo, 3)}><label class = "full" for="star3" title="3"></label>
                <input type="radio" id="star2" name="rating" value="2" ${EditView.addCheckedForImportanceRadioInputField(todo, 2)}><label class = "full" for="star2" title="2"></label>
                <input type="radio" id="star1" name="rating" value="1" ${EditView.addCheckedForImportanceRadioInputField(todo, 1)}><label class = "full" for="star1" title="1"></label>
            </fieldset>
        </div>
        <label class="form-label" for="importance">Importance</label>        
      </div>
      <div class="form-item-wrapper color-chooser-wrapper">
        ${EditView.createColorChooser(todo)}
      </div>
      <div class="form-item-wrapper">
        <input id="duedate" class="form-input-small duedate-field" type="datetime-local" name="duedate" placeholder="" value="${getLocalDateTimeAsISOString(todo.dueDate)}">
        <label class="form-label" for="duedate">Due Date</label>
      </div>
      <div class="form-item-wrapper validation-message">
      </div>
      <div class="form-item-wrapper">
        <p class="item-detail-infos">${createAdditionalItemInfoString(todo)}</p>
      </div>
        `;
    }

    static createValidityMessage(msg) {
        return `<p>${msg}</p>`;
    }

    static renderItemEditPopUp(todo) {
        const todoEditElement = document.querySelector(".edit-form-wrapper");
        todoEditElement.innerHTML = EditView.createEditPopUp(todo);
    }

    static getActiveSortButton() {
        return document.querySelector(".sort-button[data-is-active=\"true\"]");
    }

    static getFormElement() {
        return document.querySelector(".edit-form");
    }

    static showEditPopUp() {
        const popupPane = document.querySelector(".edit-pane");
        popupPane.setAttribute("data-is-popup-visible", "true");
    }

    static hideEditPopUp() {
        const popupPane = document.querySelector(".edit-pane");
        popupPane.setAttribute("data-is-popup-visible", "false");
    }

    static isEditPopUpVisible() {
        const isVisibleAttribute = document.querySelector(".edit-pane")
            .getAttribute("data-is-popup-visible");
        return isVisibleAttribute === "true";
    }

    static setColorChooserValue(item) {
        const editColorChooserElement = document.querySelector(".color-chooser-wrapper");
        editColorChooserElement.innerHTML = EditView.createColorChooser(item);
    }

    static showValidityWarning(text) {
        const validityMessageElement = document.querySelector(".validation-message");
        validityMessageElement.innerHTML = EditView.createValidityMessage(text);
    }
}
