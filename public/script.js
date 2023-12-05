function addTask(e) {
  e.preventDefault();
  var newTaskInput = document.getElementById("new-task");
  var newTask = newTaskInput.value.trim();

  if (newTask !== "") {
    fetch("/addTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "newTask=" + encodeURIComponent(newTask),
    })
      .then((response) => response.text())
      .then((updatedHTML) => {
        document.getElementById("list-todo").innerHTML = updatedHTML;

        // After updating the HTML, reattach event listeners to the remove buttons
        attachRemoveTaskListeners();
      })
      .catch((error) => console.error("Error adding task:", error));

    newTaskInput.value = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Attach initial event listeners
  attachRemoveTaskListeners();
});

function attachRemoveTaskListeners() {
  // Remove existing event listeners from all buttons
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.removeEventListener("click", handleRemoveTask);
  });

  // Attach event listeners to all buttons
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", handleRemoveTask);
  });
}

function handleRemoveTask() {
  const taskId = this.dataset.taskId; // 'this' refers to the button clicked
  removeTask(taskId);
}

function removeTask(id) {
  fetch("/removeTask/" + id, {
    method: "POST",
  })
    .then((response) => response.text())
    .then((updatedHTML) => {
      document.getElementById("list-todo").innerHTML = updatedHTML;

      // After updating the HTML, reattach event listeners to the remove buttons
      attachRemoveTaskListeners();
    })
    .catch((error) => console.error("Error removing task:", error));
}
