import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true }, // Unique identifier
    title: { type: String, required: true },
    description: { type: String, required: true },
    start_price: { type: Number, required: true },
    reserve_price: { type: Number, required: true },
});

const AuctionItem = mongoose.model('AuctionItem', productSchema);
export default AuctionItem;
