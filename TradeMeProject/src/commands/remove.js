import mongoose from 'mongoose';
import AuctionItem from '../models/AuctionItem.js'; // Your Product model
import chalk from 'chalk';

async function remove(title) {
    const mongoURI = process.env.MONGO_URI;
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI);
        console.log(chalk.green.bold('Connected to MongoDB - ', mongoURI));

        // Find and delete the product by title
        const result = await AuctionItem.findOneAndDelete({ title });

        if (result) {
            console.log(
                chalk.green.bold(
                    `Item with title "${title}" was successfully removed.`
                )
            );
            console.log();
        } else {
            console.log(
                chalk.red.bold(`No product found with title "${title}".`)
            );
        }
    } catch (err) {
        console.error(chalk.red.bold('Error removing product:', err));
    } finally {
        mongoose.connection.close();
    }
}

export default remove;
