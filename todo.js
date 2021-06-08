import chalk from "chalk";
import readlineSync from "readline-sync";
import fs from "fs";

let todoDataObject = { todos: [] };
let todoData = todoDataObject.todos;
const todoExists = fs.existsSync("todo-data.json");
if (todoExists) {
    todoDataObject = JSON.parse(fs.readFileSync("todo-data.json"));
    todoData = todoDataObject.todos;
}

showBanner();
while (true) {
    checkPomodoro();
    const exit = mainMenu();
    if (exit) {
        break;
    }
}

function mainMenu() {
    const options = ["add"];
    if (todoData && todoData.length > 0) {
        options.push("list", "check", "remove", "pomodoro");
    }
    const selected = readlineSync.keyInSelect(options, "Type your command");
    switch (options[selected]) {
        case "add":
            add();
            break;
        case "list":
            list();
            break;
        case "check":
            check();
            break;
        case "remove":
            remove();
            break;
        case "pomodoro":
            pomodoro();
            break;
        default:
            return true;
    }
}

function add() {
    const todo = readlineSync.question("What do you want to do? ");
    todoData.push({
        todo,
        done: false,
        pomodoros: 0,
        pomodoroStart: 0,
    });
    fs.writeFileSync("todo-data.json", JSON.stringify(todoDataObject));
}

function list() {
    console.log("\n============================");
    todoData.forEach((t) => console.log(formatTasks(t)));
    console.log("============================\n");
}

function check() {
    const options = todoData.map((t) => formatTasks(t));
    const checkQuestion = readlineSync.keyInSelect(
        options,
        "What do you want to check? "
    );
    if (checkQuestion === -1) {
        return;
    }
    todoData[checkQuestion].done = !todoData[checkQuestion].done;
    fs.writeFileSync("todo-data.json", JSON.stringify(todoDataObject));
}

function remove() {
    const options = todoData.map((t) => formatTasks(t));
    const checkQuestion = readlineSync.keyInSelect(
        options,
        "What do you want to remove? "
    );
    if (checkQuestion === -1) {
        return;
    }
    todoData.splice(checkQuestion, 1);
    fs.writeFileSync("todo-data.json", JSON.stringify(todoDataObject));
}

function pomodoro() {
    const options = todoData.map((t) => formatTasks(t));
    const checkQuestion = readlineSync.keyInSelect(
        options,
        "What to do do you want to have a pomodoro? "
    );
    if (checkQuestion === -1) {
        return;
    }
    todoData[checkQuestion].pomodoroStart = Date.now();
    fs.writeFileSync("todo-data.json", JSON.stringify(todoDataObject));
}

function checkPomodoro() {
    todoData.forEach((t) => {
        if (t.pomodoroStart !== 0 && Date.now() - t.pomodoroStart > 1500000) {
            t.pomodoroStart = 0;
            t.pomodoros = t.pomodoros + 1;
            fs.writeFileSync("todo-data.json", JSON.stringify(todoDataObject));
        }
    });
}

function formatTasks(tasks) {
    return (
        (tasks.done ? "🟢 " : "🔴 ") +
        tasks.todo +
        " " +
        String("🍅").repeat(tasks.pomodoros) +
        (tasks.pomodoroStart !== 0 ? "⏲️" : "")
    );
}

function showBanner() {
    const todo =
        chalk.magenta("T") +
        chalk.red("O") +
        chalk.yellow("D") +
        chalk.blue("O");
    console.log(chalk.green`
‖==========‖
‖ TERMINAL ‖
‖   ${todo}   ‖
‖==========‖`);
}
