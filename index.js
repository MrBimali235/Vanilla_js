const form = document.querySelector(".my-form");
const listBox = document.querySelector(".list-box");
const clear = document.querySelector(".clear-btn");

const currentDate = new Date();
document
  .getElementById("deadline")
  .setAttribute("min", currentDate.toISOString().split("T")[0]);

window.addEventListener("DOMContentLoaded", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let obj = new TODO();
  savedTasks.forEach((task) => obj.renderTask(task));
});

const handleSubmit = function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("task").value.trim();
  const lettersOnly = /^[A-Za-z]+$/;

  if (!lettersOnly.test(nameInput)) {
    alert("Please enter letters only (no numbers or symbols).");
    return;
  }

  const deadlineInput = document.getElementById("deadline").value;

  if (!deadlineInput) {
    alert("Please specify a deadline date.");
    return;
  }

  const formData = new FormData(form);
  const task = formData.get("task").trim();
  const deadline = formData.get("deadline");

  let obj = new TODO();
  obj.addList(task, deadline);

  form.reset();
};

form.addEventListener("submit", handleSubmit);

class FORM {
  constructor(task, deadline, checked = false) {
    this.Task = task;
    this.Deadline = deadline;
    this.Checked = checked;
  }
}

class TODO {
  renderTask(el) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(el.Deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const pastDeadline = deadlineDate < today;
    const isChecked = el.Checked;

    const statusClass =
      pastDeadline && !isChecked ? "past-deadline" : "upcoming";
    const checkboxDisabled = pastDeadline && !isChecked ? "disabled" : "";

    const html = `
      <div class="task-item" data-task="${el.Task}" data-deadline="${
      el.Deadline
    }">
        <div class="task-left">  
          <input type="checkbox"
            class="checkbox"
            ${checkboxDisabled}
            ${isChecked ? "checked" : ""}>
          <p class="task-text ${statusClass} ${isChecked ? "checked" : ""}">${
      el.Task
    }</p>
        </div>
        <button class="delete-btn" aria-label="Delete task">
          <svg xmlns="http://www.w3.org/2000/svg"
               width="20" height="20"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               stroke-width="2"
               stroke-linecap="round"
               stroke-linejoin="round"
               class="feather feather-trash">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-2 14H7L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"></path>
          </svg>
        </button>
      </div>
    `;

    listBox.insertAdjacentHTML("afterbegin", html);
  }

  addList(task, deadline) {
    const newTask = new FORM(task, deadline, false);
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    existingTasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(existingTasks));
    this.renderTask(newTask);
  }
}

const handleChecks = function (e) {
  if (e.target.classList.contains("checkbox")) {
    const textElement = e.target.nextElementSibling;
    const taskItem = e.target.closest(".task-item");

    if (textElement) {
      textElement.classList.toggle("checked");
    }

    const taskName = taskItem.getAttribute("data-task");
    const taskDeadline = taskItem.getAttribute("data-deadline");

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.map((t) => {
      if (t.Task === taskName && t.Deadline === taskDeadline) {
        t.Checked = e.target.checked;
      }
      return t;
    });

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  } else {
    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
      const taskItem = deleteBtn.closest(".task-item");
      if (taskItem) {
        const taskName = taskItem.getAttribute("data-task");
        const taskDeadline = taskItem.getAttribute("data-deadline");

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(
          (t) => !(t.Task === taskName && t.Deadline === taskDeadline)
        );
        localStorage.setItem("tasks", JSON.stringify(tasks));

        taskItem.remove();
      }
    }
  }
};

listBox.addEventListener("click", handleChecks);

const handleClear = function () {
  while (listBox.firstChild) {
    listBox.removeChild(listBox.firstChild);
  }
  localStorage.removeItem("tasks");
};

clear.addEventListener("click", handleClear);
