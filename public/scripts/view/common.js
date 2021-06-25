import {getHumanReadableDate} from "../utils.js";

export function getHeaderContent(currentPage) {
    let indexIsActive = "false";
    let aboutIsActive = "false";

    // eslint-disable-next-line default-case
    switch (currentPage) {
    case "index":
        indexIsActive = "true";
        break;
    case "about":
        aboutIsActive = "true";
        break;
    }

    return `
      <nav class="page-nav">
        <ul class="page-nav-list">
          <li id="top" class="page-nav-list-item" data-is-active="${indexIsActive}" > 
            <a class="page-nav-link" href="./index.html">Home</a>
          </li>
          <li class="page-nav-list-item" data-is-active="${aboutIsActive}" >
            <a class="page-nav-link" href="./about.html">About</a>
          </li>
        </ul>
      </nav>
      <h1 class="page-title">Toby's Note App</h1>
      <div>
        <button class="action-button alarm-button" data-is-selected="true"></button>
        <select class="theme-changer action-button">
          <option value="auto">AUTO-Theme</option>
          <option value="light-theme">Light-Theme</option>
          <option value="dark-theme">Dark-Theme</option>
          <option value="neon-theme">Neon-Theme</option>
          <option value="rainbow-theme">Rainbow-Theme</option>
        </select>
      </div>
    `;
}

export function getAsideContent() {
    return `
    <div class="aside-info-wrapper">
        <h2>Quick edit key bindings</h2>
        <h3>List-View</h3>
        <p>Press <span>+</span> key to add a new note.</p>
        <p>Press the <span>space</span> key to hide/show completed notes.</p>
        <h3>Edit-View</h3>
        <p>Press the <span>esc</span> key to cancel and close the edit-view.</p>
        <p>Press <span>ctrl+s</span> to save the current note.</p>
        <p>Press <span>ctrl+shift+s</span> to save the current note and close the edit-view.</p>
        <p>Press the <span>ctrl+&#8592;</span> key to cancel the current note and open the previous one.</p>
        <p>Press the <span>ctrl+&#8594;</span> key to cancel the current note and open the next one.</p>
    </div>
  <div class="aside-quote-wrapper">
  </div>`;
}

export function getPageFooter() {
    return `
    <div class="footer-top-link-container">
        <a class="footer-top-link" href="#top"><span>&#10140;</span></a>
    </div>
    <p>&copy; Tobias Hanselmann</p>
    <p>v1.0 25.06.2021</p>`;
}

export function createAdditionalItemInfoString(todo) {
    return `ID: ${todo.id}; creation date: ${getHumanReadableDate(todo.creationDate)}; 
    last modified: ${getHumanReadableDate(todo.modificationDate)}; 
    completed: ${todo.isCompleted}`;
}
