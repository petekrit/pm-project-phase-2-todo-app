const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const templateFilePath = path.resolve(__dirname, "../views/list.ejs");

const templateFile = fs.readFileSync(templateFilePath, "utf-8");

const removeSpaces = (str) => str.replace(/\s/g, "");

test("EJS test for Empty List", () => {
  const data = {
    tasks: [],
  };

  const renderedHTML = ejs.render(templateFile, data);
  const expectedHTML = `
    <div id="list-todo"></div>
  `;
  expect(removeSpaces(renderedHTML)).toEqual(removeSpaces(expectedHTML));
});

test("EJS test for Multiple Tasks", () => {
  const data = {
    tasks: [
      { id: 1, value: "Task 1" },
      { id: 2, value: "Task 2" },
      { id: 3, value: "Task 3" },
    ],
  };

  const renderedHTML = ejs.render(templateFile, data);
  const expectedHTML = `
    <div id="list-todo">
        <li>
            <span>
            Task 1
            </span>
            <button class="remove-btn" data-task-id="1">Remove</button>
        </li>
        <li>
            <span>
            Task 2
            </span>
            <button class="remove-btn" data-task-id="2">Remove</button>
        </li>
        <li>
            <span>
            Task 3
            </span>
            <button class="remove-btn" data-task-id="3">Remove</button>
        </li>
    </div>
  `;
  expect(removeSpaces(renderedHTML)).toEqual(removeSpaces(expectedHTML));
});

test("EJS test for Special Characters in Task", () => {
  const data = {
    tasks: [{ id: 1, value: "<Task with special characters>" }],
  };

  const renderedHTML = ejs.render(templateFile, data);
  const expectedHTML = `
    <div id="list-todo">
        <li>
            <span>
            &lt;Task with special characters&gt;
            </span>
            <button class="remove-btn" data-task-id="1">Remove</button>
        </li>
    </div>
  `;
  expect(removeSpaces(renderedHTML)).toEqual(removeSpaces(expectedHTML));
});

test("EJS test for Deleting a Task", () => {
  const data = {
    tasks: [
      { id: 1, value: "Task 1" },
      { id: 2, value: "Task 2" },
      { id: 3, value: "Task 3" },
    ],
  };

  const renderedHTMLBeforeDeletion = ejs.render(templateFile, data);

  const updatedData = {
    tasks: [
      { id: 1, value: "Task 1" },
      { id: 3, value: "Task 3" },
    ],
  };

  const renderedHTMLAfterDeletion = ejs.render(templateFile, updatedData);

  const expectedHTML = `
    <div id="list-todo">
        <li>
            <span>
            Task 1
            </span>
            <button class="remove-btn" data-task-id="1">Remove</button>
        </li>
        <li>
            <span>
            Task 3
            </span>
            <button class="remove-btn" data-task-id="3">Remove</button>
        </li>
    </div>
  `;

  expect(removeSpaces(renderedHTMLAfterDeletion)).toEqual(
    removeSpaces(expectedHTML)
  );
  expect(removeSpaces(renderedHTMLBeforeDeletion)).not.toEqual(
    removeSpaces(expectedHTML)
  );
});
