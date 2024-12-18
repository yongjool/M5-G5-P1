import mongoose from 'mongoose';
import AuctionItem from '../../api/models/AuctionItem.js'; //  model for MongoDB
import chalk from 'chalk';

async function update(_id, updatedFields) {
    const mongoURI = process.env.MONGO_URI;
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI);
        console.log(chalk.green.bold('Connected to MongoDB - ', mongoURI));

        // Fetch the product by the old title to get the old properties
        const oldItem = await AuctionItem.findOne({ _id });

        if (!oldItem) {
            console.log(
                chalk.red.bold(`No item found with Stock Keeping Unit ${_id}.`)
            );
            mongoose.connection.close();
            return;
        }

        // Log the old properties
        console.log(chalk.yellow.bold('Old item Properties:'));
        console.log(chalk.yellow(oldItem));

        // Find the product by the old title and update the specified fields
        const updatedItem = await AuctionItem.findOneAndUpdate(
            { _id },
            updatedFields,
            { new: true } // Return the updated document
        );

        if (updatedItem) {
            // Log the new properties after the update
            console.log(chalk.blue.bold('Updated Item Properties:'));
            console.log(chalk.blue(updatedItem));
        } else {
            console.log(chalk.red.bold(`No item found. ID : ${_id}.`));
        }

        // Close the connection after operation
        mongoose.connection.close();
    } catch (err) {
        console.error(chalk.red.bold('Error updating product:', err));
    } finally {
        mongoose.connection.close();
    }
}

export default update;
