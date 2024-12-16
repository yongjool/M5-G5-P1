import chalk from 'chalk';
import mongoose from 'mongoose';
import AuctionItem from '../models/AuctionItem.js'; //  model for MongoDB

async function list() {
    const mongoURI = process.env.MONGO_URI;
    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(mongoURI);
        console.log(chalk.green.bold('Connected to MongoDB - ', mongoURI));

        // Fetch all products from the database
        const items = await AuctionItem.find();

        if (items.length > 0) {
            items.forEach((item, index) => {
                console.log(
                    chalk.yellowBright(
                        `${index + 1}. ${item.title} , ${item.description} , $${
                            item.start_price
                        }, $${item.reserve_price}`
                    )
                );
            });
        } else {
            console.log(chalk.red.bold('No products found in the database.'));
        }
    } catch (err) {
        console.error(chalk.red.bold('Error fetching data:', err));
    } finally {
        mongoose.connection.close();
    }
}

export default list;
