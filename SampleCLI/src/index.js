#!/usr/bin/env node

import { program } from 'commander';
import list from './commands/list.js';
import add from './commands/add.js';
import markDone from './commands/markDone.js';

/*

    program.command: takes a string that defines the format of the command
    program.description: describes the command for the user. This is helpful when the user executes our tool with the option --help
    program.option: the options that this command can take, if any
    program.action: the action that this command performs, which will be a function

*/

// prettier-ignore
program
    .command('list')
    .description('List all the TODO tasks')
    .action(list);

// prettier-ignore
program
    .command('add <task>')
    .description('Add a new TODO task')
    .action(add)

// prettier-ignore
program
    .command('mark-done')
    .description('Mark commands done')
    .option('-t, --tasks <tasks...>', 'The tasks to mark done. If not specified, all tasks will be marked done.')
    .action(markDone)

program.parse(); // This line is important. It tells commander to parse the arguments and execute the appropriate command.
