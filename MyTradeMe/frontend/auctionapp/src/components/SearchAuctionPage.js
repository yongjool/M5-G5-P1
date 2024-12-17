import React, { useState } from 'react';
import axios from 'axios'; // Import axios if not already imported
import './SearchAuctionPage.css';

const SearchAuctionPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [auctionItems, setAuctionItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const callSearchAPI = async (searchString) => {
        try {
            const response = await axios.get(
                'http://localhost:4000/api/search',
                {
                    params: {
                        query: searchString,
                    },
                }
            );

            // Check if response status is 200 and auctionItems exist in the response data
            if (
                response.status === 200 &&
                Array.isArray(response.data.auctionItems)
            ) {
                return response.data.auctionItems; // Return auction items if status is 200
            } else {
                throw new Error('Failed to fetch search results');
            }
        } catch (error) {
            // Combine error.message and API-provided message
            const apiMessage =
                error.response?.data?.message ||
                'No additional details provided.';
            const combinedMessage = `${error.message}\n${apiMessage}`;

            setError(combinedMessage); // Set the combined error message in state
            console.error('Error fetching search results:', combinedMessage);
            return []; // Return empty array if there's an error
        }
    };

    const handleSearchSubmit = async () => {
        setAuctionItems([]);
        setLoading(true);
        setError(null); // Reset error

        try {
            const results = await callSearchAPI(searchQuery);
            setAuctionItems(results); // Assuming results is an array of items
        } catch (error) {
            setAuctionItems([]); // Clear previous items on error
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    return (
        <div className="search-auction-container">
            <h1>Search Auction Item</h1>
            <div className="search-input-container">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for auction items..."
                />
                <button onClick={handleSearchSubmit}>Search</button>
            </div>

            {loading && (
                <div className="auction-card loading-card">
                    <p>Loading...</p>
                </div>
            )}

            {error && (
                <div className="auction-card error-card">
                    <h3>Error</h3>
                    {/* Render error message with newline formatting */}
                    <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
                </div>
            )}

            {/* Display "No items found" if no auction items */}
            {auctionItems.length === 0 && !loading && !error && (
                <div className="auction-card no-items-card">
                    <h3>No items found</h3>
                </div>
            )}

            <div className="auction-items-grid">
                {auctionItems.map((item, index) => (
                    <div key={index} className="auction-card">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <div className="auction-prices">
                            <p>
                                <strong>Start Price:</strong> ${item.startPrice}
                            </p>
                            <p>
                                <strong>Reserve Price:</strong> $
                                {item.reservePrice}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchAuctionPage;
