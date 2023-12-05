const ejs = require("ejs");
const path = require("path")
const fs = require("fs");

const templateFilePath = path.resolve(__dirname, "../views/list.ejs");

const templateFile = fs.readFileSync(templateFilePath, "utf-8");

const removeSpaces = (str) => str.replace(/\s/g, "");

test("EJS test for List", () => {
  const data = {
    tasks: [{id: 1, value: "Task 1"}],
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
    </div>
  `;
  expect(removeSpaces(renderedHTML)).toEqual(removeSpaces(expectedHTML));
});
