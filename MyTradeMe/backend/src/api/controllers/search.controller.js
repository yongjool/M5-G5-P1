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
            responseMimeType: 'application/json',
        };

        const systemInstruction = `
Create a search query for an auction house to find a specific item. 
Provide multiple guesses or variations of the item’s exact name, category, condition, or key attributes. 
Based on these guesses, generate the best possible description of the item that closely matches the query.
Return the description in an array format with no repeated words, special characters, or explanations.
The final output must be in JSON format and include:
A search property, which is an array of precise keywords related to the specific item (name, category, condition, specific attributes).
If the user mentions any price-related terms, include minPrice and/or maxPrice property as numeric values. 
If no price-related terms are mentioned, omit the minPrice and maxPrice properties entirely (do not include null or empty values).
if user input in one word, return the same word in the search property.
Do not add any other properties than search, minPrice and maxPrice. 
Avoid vague terms that can apply to multiple objects.
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
        const aiResponseText = JSON.parse(result.response.text());

        console.log(aiResponseText);

        // Search for auction items based on the AI's response in both title or description
        const searchTerm = {
            $and: [
                {
                    $or: [
                        {
                            title: {
                                $regex: `\\b${aiResponseText.search.join(
                                    '\\b|\\b'
                                )}\\b`, // Match whole words in title
                                $options: 'i', // Case-insensitive search
                            },
                        },
                        {
                            description: {
                                $regex: `\\b${aiResponseText.search.join(
                                    '\\b|\\b'
                                )}\\b`, // Match whole words in description
                                $options: 'i', // Case-insensitive search
                            },
                        },
                    ],
                },
            ],
        };

        if (aiResponseText.minPrice) {
            searchTerm.$and.push({
                reserve_price: {
                    $gte: aiResponseText.minPrice, // Price greater than or equal to minPrice
                },
            });
        }

        // Optionally, add maxPrice condition if maxPrice exists
        if (aiResponseText.maxPrice) {
            searchTerm.$and.push({
                reserve_price: {
                    $lt: aiResponseText.maxPrice, // Price less than maxPrice
                },
            });
        }

        const auctionItems = await AuctionItem.find(searchTerm);

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
