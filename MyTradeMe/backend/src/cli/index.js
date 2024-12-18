#!/usr/bin/env node

import { program } from 'commander';
import dotenv from 'dotenv';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve the root directory (adjust path if needed)
const rootPath = resolve(__dirname, '../../'); // Adjust to your root folder relative to index.js

// Load the .env file from the root directory
dotenv.config({ path: resolve(rootPath, '.env') });

import list from './commands/list.js';
import add from './commands/add.js';
import remove from './commands/remove.js';
import update from './commands/update.js';

// prettier-ignore
program
    .command('list')
    .description('List all the Auction items')
    .action(list);

// prettier-ignore
program
    .command('add')
    .description('Add Auction items - title, description, start_price, reserve_price.')
    .requiredOption('-t, --title <title>', 'Title of the auction item')
    .requiredOption('-d, --description <description>', 'Description of the auction item')
    .requiredOption('-s, --start_price <start_price>', 'Starting price of the auction item', (val) => parseFloat(val))
    .requiredOption('-r, --reserve_price <reserve_price>', 'Reserve price of the auction item', (val) => parseFloat(val))
    .action((options) => {
        add(options.title, options.description, options.start_price, options.reserve_price);
    });

// prettier-ignore
program
    .command('remove')
    .description('Remove an auction item by _id')
    .requiredOption('-k, --key <_id>', '_id of the item to remove')
    .action((options) => {
        remove(options.key);
    });

// prettier-ignore
program
    .command('update')
    .description('Update an auction item by _id')
    .requiredOption('-k, --key <_id>', '_id of the item to update')
    .option('-t, --title <title>', 'New title of the item')
    .option('-d, --description <description>', 'New description of the item')
    .option('-s, --start_price <start_price>', 'Update start price of the item', parseFloat)
    .option('-r, --reserve_price <reserve_price>', 'Update reserve price of the item', parseFloat)
    .action((options) => {
        const updatedFields = {};
        if (options.title) updatedFields.title = options.title; 
        if (options.description) updatedFields.description = options.description;
        if (options.start_price) updatedFields.start_price = options.start_price;
        if (options.reserve_price) updatedFields.reserve_price = options.reserve_price;
        update(options.key, updatedFields);
      });

program.parse(); // This line is important. It tells commander to parse the arguments and execute the appropriate command.
