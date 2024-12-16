import Conf from 'conf';
import chalk from 'chalk';

// Add projectName to the Conf initialization
const conf = new Conf({
    projectName: 'todos' // This will specify the name of the configuration file
});

function list() {
    const todoList = conf.get('todo-list');
    console.log(todoList); // Add this for debugging purposes
    if (todoList && todoList.length) {
        console.log(
            chalk.blue.bold('Tasks in green are done. Tasks in yellow are still not done.')
        );
        todoList.forEach((task, index) => {
            if (task.done) {
                console.log(
                    chalk.greenBright(`${index}. ${task.text}`)
                );
            } else {
                console.log(
                    chalk.yellowBright(`${index}. ${task.text}`)
                );
            }
        });
    } else {
        console.log(
            chalk.red.bold('You don\'t have any tasks yet.')
        );
    }
}

export default list;
