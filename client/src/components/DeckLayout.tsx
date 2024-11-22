import React, { useState } from 'react';
import { Row, Col, Card, Accordion, Modal, Button } from 'react-bootstrap';
import { Decks } from '../interfaces/Deck.js';
import CardBack from '../assets/button.png';

interface DeckListProps {
    decks: Decks[];
}

const DeckList: React.FC<DeckListProps> = ({ decks }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState<any>(null);

    const handleCardClick = (card: any) => {
        setSelectedCard(card);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCard(null);
    };

    return (
        <>
            <Row>
                {decks.map((deck) => (
                    <Col md="4" key={deck.id}>
                        <Accordion>
                            <Accordion.Item eventKey={`${deck.id}-header`}>
                                <Accordion.Header>
                                    <Card border="dark">
                                        <div style={{ position: 'relative', width: '100%' }}>
                                            <Card.Img
                                                src={CardBack}
                                                alt={`YuGiOh deck image`}
                                                variant="top"
                                                style={{ display: 'block', width: '100%', height: 'auto' }}
                                            />
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    color: 'white',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                    padding: '5px 10px',
                                                    borderRadius: '5px',
                                                    fontSize: '3em',
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {deck.name}
                                            </div>
                                        </div>
                                        <Card.Body>
                                            <Card.Text>
                                                Playable?: {deck.playable ? 'yes' : 'no'}
                                            </Card.Text>
                                            <Card.Text>Type: {deck.type}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        {deck.cards?.map((card) => (
                                            <Col md="4" sm="6" xs="12" key={card.id} className="mb-4">
                                                <Card
                                                    border="dark"
                                                    onClick={() => handleCardClick(card)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {card.image && (
                                                        <Card.Img
                                                            src={card.image}
                                                            alt={`Art for ${card.name}`}
                                                            variant="top"
                                                            style={{ maxHeight: '100px', objectFit: 'contain' }}
                                                        />
                                                    )}
                                                    <Card.Body>
                                                        <Card.Text>{card.name}</Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                ))}
            </Row>

            {/* Modal */}
            {selectedCard && (
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedCard.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedCard.image && (
                            <Card.Img
                                src={selectedCard.image}
                                alt={`Art for ${selectedCard.name}`}
                                variant="top"
                                style={{ maxWidth: '100%', marginBottom: '1rem' }}
                            />
                        )}
                        <Card.Text>ATR: {selectedCard.attribute}</Card.Text>
                        <Card.Text>Level: {selectedCard.level}</Card.Text>
                        <Card.Text>Race: {selectedCard.race}</Card.Text>
                        <Card.Text>Type: {selectedCard.type}</Card.Text>
                        <Card.Text>{selectedCard.description}</Card.Text>
                        <Card.Text>ATK: {selectedCard.attack}</Card.Text>
                        <Card.Text>DEF: {selectedCard.defense}</Card.Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default DeckList;