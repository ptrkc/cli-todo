import chalk from "chalk";
import readlineSync from "readline-sync";
import fs from "fs";

let todoData = { todos: [] };

const todoExists = fs.existsSync("todo-data.json");
if (todoExists) {
    todoData = JSON.parse(fs.readFileSync("todo-data.json"));
}

showBanner();

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

while (true) {
    checkPomodoro();
    const exit = mainMenu();
    if (exit) {
        break;
    }
}

function mainMenu() {
    const options = ["add"];
    if (todoData && todoData.todos.length > 0) {
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
    todoData.todos.push({
        todo,
        done: false,
        pomodoros: 0,
        pomodoroStart: 0,
    });
    fs.writeFileSync("todo-data.json", JSON.stringify(todoData));
}

function list() {
    console.log("\n==================");
    todoData.todos.forEach((t) =>
        console.log(
            (t.done ? "🟢 " : "🔴 ") +
                t.todo +
                " " +
                String("🍅").repeat(t.pomodoros) +
                (t.pomodoroStart !== 0 ? "⏲️" : "")
        )
    );
    console.log("==================\n");
}

function check() {
    const options = todoData.todos.map(
        (t) =>
            (t.done ? "🟢 " : "🔴 ") +
            t.todo +
            " " +
            String("🍅").repeat(t.pomodoros) +
            (t.pomodoroStart !== 0 ? "⏲️" : "")
    );
    const checkQuestion = readlineSync.keyInSelect(
        options,
        "What do you want to check? "
    );
    if (checkQuestion === -1) {
        return;
    }
    todoData.todos[checkQuestion].done = !todoData.todos[checkQuestion].done;
    fs.writeFileSync("todo-data.json", JSON.stringify(todoData));
}

function remove() {
    const options = todoData.todos.map(
        (t) =>
            (t.done ? "🟢 " : "🔴 ") +
            t.todo +
            " " +
            String("🍅").repeat(t.pomodoros) +
            (t.pomodoroStart !== 0 ? "⏲️" : "")
    );
    const checkQuestion = readlineSync.keyInSelect(
        options,
        "What do you want to remove? "
    );
    if (checkQuestion === -1) {
        return;
    }
    todoData.todos.splice(checkQuestion, 1);
    fs.writeFileSync("todo-data.json", JSON.stringify(todoData));
}

function pomodoro() {
    const options = todoData.todos.map(
        (t) =>
            (t.done ? "🟢 " : "🔴 ") +
            t.todo +
            " " +
            String("🍅").repeat(t.pomodoros) +
            (t.pomodoroStart !== 0 ? "⏲️" : "")
    );
    const checkQuestion = readlineSync.keyInSelect(
        options,
        "What to do do you want to have a pomodoro? "
    );
    if (checkQuestion === -1) {
        return;
    }
    todoData.todos[checkQuestion].pomodoroStart = Date.now();
    fs.writeFileSync("todo-data.json", JSON.stringify(todoData));
}

function checkPomodoro() {
    todoData.todos.forEach((t) => {
        if (t.pomodoroStart !== 0 && Date.now() - t.pomodoroStart > 1500000) {
            t.pomodoroStart = 0;
            t.pomodoros = t.pomodoros + 1;
            fs.writeFileSync("todo-data.json", JSON.stringify(todoData));
        }
    });
}
