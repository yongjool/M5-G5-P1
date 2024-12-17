import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import chalk from 'chalk';
import AuctionItem from '../../api/models/AuctionItem.js'; //  model for MongoDB

async function add(title, description, start_price, reserve_price) {
    const mongoURI = process.env.MONGO_URI;
    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(mongoURI);
        console.log(chalk.green.bold('Connected to MongoDB - ', mongoURI));

        // Create a new product instance
        const newItem = new AuctionItem({
            sku: nanoid(10), // Generate a unique SKU
            title,
            description,
            start_price,
            reserve_price,
        });

        console.log(
            chalk.yellowBright(
                `Item added SKU: ${newItem.sku}, ${newItem.title} , ${newItem.description} , $${newItem.start_price}, $${newItem.reserve_price}`
            )
        );

        // Save the product to the database
        await newItem.save();

        //display message to user
        console.log(chalk.green.bold('Item has been added successfully!'));
    } catch (err) {
        console.error(chalk.red.bold('Error adding data:', err));
    } finally {
        mongoose.connection.close();
    }
}

export default add;
