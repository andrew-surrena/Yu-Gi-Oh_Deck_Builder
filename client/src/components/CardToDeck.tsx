import { Form, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Cards } from '../interfaces/Card.js';
import { Decks } from '../interfaces/Deck.js';
import { ADD_CARD_TO_DECK, SAVE_NEW_CARD } from '../utils/mutations.js';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_GETALLDECKS } from '../utils/queries.js';
import Auth from "../utils/auth";

interface CardtoDeckProps {
    card: Cards;
}

const username = Auth.getUsername();

const CardtoDeck: React.FC<CardtoDeckProps> = ({ card }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null); // Tracks selected "Save Card" option
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null); // Tracks selected deck
    const [statusMessage, setStatusMessage] = useState<string | null>(null); // Tracks status message
    const { data: deckDataQuery, loading: deckLoading, error: deckError } = useQuery(QUERY_GETALLDECKS, {
        variables: { username }
    });

    const [addCardToDeckMutation] = useMutation(ADD_CARD_TO_DECK);
    const [addCardToUserMutation] = useMutation(SAVE_NEW_CARD);

    // Effect to set the first deck as the default selected deck
    useEffect(() => {
        if (deckDataQuery && deckDataQuery.allDecks) {
            setSelectedDeckId(deckDataQuery.allDecks[0]?.id || null);
        }
    }, [deckDataQuery]);

    if (!card) return null;

    const handleSubmit = async () => {
        let cardId = card._id;
        // console.log('here is the card data:', card);
    
        // Save new card if needed
        if (!cardId && selectedOption) {
            const { data } = await addCardToUserMutation({
                variables: {
                    input: {
                        name: card.name,
                        attribute: card.attribute,
                        level: card.level,
                        race: card.race,
                        type: card.type,
                        archetype: card.archetype,
                        description: card.description,
                        atk: card.atk,
                        def: card.def,
                        image: card.image,
                    },
                },
            });
            cardId = data.addCardToUser._id;
        }
    
        // console.log(`here is the deck data:`, deckDataQuery);
    
        // Find the selected deck by ID
        const selectedDeck = deckDataQuery?.user.allDecks.find((deck: Decks) => deck._id === selectedDeckId);
        // console.log(`here is the selected deck:`, selectedDeck);
    
        if (selectedOption === '1') {
            setStatusMessage("Card Added To Collection");
            // console.log('Card Saved to My Collection');
        } else if (selectedOption === '2' && selectedDeck) {
            // console.log(`here is the deckId: ${selectedDeck._id}`);
            // console.log(`here is the cardId: ${cardId}`);
    
            await addCardToDeckMutation({
                variables: {
                    deckId: selectedDeck._id,
                    cardId: cardId,
                },
            });
            setStatusMessage("Card Added to Deck");
            // console.log('Card added to existing deck successfully');
        } else {
            console.error('No deck selected');
            setStatusMessage(null);
        }
    };

    if (deckLoading) return <p>Loading...</p>;
    if (deckError) return <p>Error loading deck data: {deckError.message}</p>;

    return (
        <div>
            {/* Dropdown to select "Save Card" option */}
            <Form.Group controlId="saveCardOption">
                <Form.Label>Save Card</Form.Label>
                <Form.Control as="select" value={selectedOption || ''} onChange={(e) => setSelectedOption(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="1">To My Collection</option>
                    <option value="2">To Existing Deck</option>
                </Form.Control>
            </Form.Group>

            {/* If "To Existing Deck" is selected, show the deck selection */}
            {selectedOption === '2' && deckDataQuery?.user.allDecks && (
                <Form.Group controlId="selectDeck">
                    <Form.Label style={{paddingTop: "10px"}}>Select Deck:</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedDeckId || ''}
                        onChange={(e) => setSelectedDeckId(e.target.value)}
                    >
                        <option value="">Select a deck</option>
                        {deckDataQuery.user.allDecks.map((deck: Decks) => (
                            <option key={deck._id} value={deck._id}> {/* Pass the deck.id */}
                                {deck.name} {/* Display deck name */}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            )}

            <div style={{paddingTop: "10px"}}></div>

            {/* Status Message */}
            {statusMessage && <p style={{ color: "green", marginBottom: "10px" }}>{statusMessage}</p>}

            {/* Submit button */}
            <Button variant="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    );
};

export default CardtoDeck;
