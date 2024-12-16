import Conf from 'conf';
import chalk from 'chalk';

// Add projectName to the Conf initialization
const conf = new Conf({
  projectName: 'todos', // This will specify the name of the configuration file
});

function add(task) {
  //get the current todo-list
  let todosList = conf.get('todo-list');

  if (!todosList) {
    //default value for todos-list
    todosList = [];
  }

  //push the new task to the todos-list
  todosList.push({
    text: task,
    done: false,
  });

  //set todos-list in conf
  conf.set('todo-list', todosList);

  //display message to user
  console.log(chalk.green.bold('Task has been added successfully!'));
}

export default add;
