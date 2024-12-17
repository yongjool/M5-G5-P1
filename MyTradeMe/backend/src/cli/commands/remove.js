import mongoose from 'mongoose';
import AuctionItem from '../../api/models/AuctionItem.js'; //  model for MongoDB
import chalk from 'chalk';

async function remove(sku) {
    const mongoURI = process.env.MONGO_URI;
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI);
        console.log(chalk.green.bold('Connected to MongoDB - ', mongoURI));

        // Find and delete the product by title
        const result = await AuctionItem.findOneAndDelete({ sku });

        if (result) {
            console.log(
                chalk.green.bold(
                    `Item '"${result.sku} - ${result.title}'" was successfully removed.`
                )
            );
            console.log();
        } else {
            console.log(
                chalk.red.bold(`No item found with Stock Keeping Unit ${sku}.`)
            );
        }
    } catch (err) {
        console.error(chalk.red.bold('Error removing item:', err));
    } finally {
        mongoose.connection.close();
    }
}

export default remove;
