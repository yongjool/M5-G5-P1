import { GoogleGenerativeAI } from '@google/generative-ai';
import AuctionItem from '../models/AuctionItem.js';

export async function searchByKeyword(req, res, next) {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // Extract the user input (query) from the request query parameters
        const { query } = req.query;

        // If no query is provided, return all auction items
        if (!query) {
            const auctionItems = await AuctionItem.find();
            return res.status(200).json({ auctionItems });
        }

        // Generate the AI's response based on the query
        const generationConfig = {
            temperature: 0,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: 'text/plain',
        };

        const systemInstruction = `
        Create a search query for an auction house to find an item. 
        You can provide multiple guesses or variations of the item’s name, category, condition, or attributes, with words separated by spaces only. 
        Based on these guesses, generate the best possible description of the item that most closely matches the query. 
        The description should be returned in array format, with no repeated words, special characters, or explanations.
        make sure your answer is in array format surrounded by [ and ].
        `;

        // Initialize the generative model with system instruction
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: systemInstruction,
        });

        // Start a new chat session and send the query to the model
        const chatSession = model.startChat({ generationConfig });
        const result = await chatSession.sendMessage(query);

        // Search for auction items based on the AI's response
        const aiResponseText = result.response.text().replace(/\n/g, ' ');

        console.log(aiResponseText);

        // Search for auction items based on the AI's response in both title or description
        const auctionItems = await AuctionItem.find({
            $or: [
                {
                    title: {
                        $regex: JSON.parse(aiResponseText).join('|'),
                        $options: 'i',
                    },
                }, // Case-insensitive search in title
                {
                    description: {
                        $regex: JSON.parse(aiResponseText).join('|'),
                        $options: 'i',
                    },
                }, // Case-insensitive search in description
            ],
        });

        // If no auction items are found, return an empty array
        if (auctionItems.length === 0) {
            return res.status(200).json({ auctionItems: [] });
        }

        // Respond with the found auction items
        res.status(200).json({ auctionItems });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
}
