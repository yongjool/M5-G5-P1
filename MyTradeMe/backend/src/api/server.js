import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import searchRoutes from './routes/search.routes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Convert the module's URL to a file path

const app = express();
app.use(cors());

app.use(json());
app.use('/api', searchRoutes);

app.use(errorMiddleware);

// Export the app (for testing)
export default app;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Set the port from environment variables or default to 4000
const PORT = process.env.PORT || 4000;

if (__filename === process.argv[1]) {
    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
        console.log(`Server is live at http://localhost:${PORT}`);
    }).on('error', (error) => {
        // Handle port-related errors
        if (error.code === 'EADDRINUSE') {
            console.error('Port is already in use');
        } else {
            console.error('Server Error:', error);
        }
    });
}
