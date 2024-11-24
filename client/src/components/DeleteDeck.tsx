import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Modal } from 'react-bootstrap';
import { DELETE_DECK } from '../utils/mutations';
import { QUERY_GETALLDECKS } from '../utils/queries'; // Assuming you are refetching the decks
import Auth from "../utils/auth";

interface DeleteDeckProps {
  deckId: string;
  deckName: string;
}

const username = Auth.getUsername();

const DeleteDeck: React.FC<DeleteDeckProps> = ({ deckId, deckName }) => {
  const [showModal, setShowModal] = useState(false); // To toggle the modal visibility
  const [deleteDeck] = useMutation(DELETE_DECK, {
    variables: { deckId }, // Pass the deckId to the mutation
    refetchQueries: [
      {
          query: QUERY_GETALLDECKS,
          variables: { username }, // Add the username variable here
      },
  ], // Refetch all decks after deleting
    onCompleted: () => {
      setShowModal(false); // Close modal on success
      // console.log('Deck deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting deck:', error.message); // Handle errors
    },
  });

  const handleDelete = async () => {
    try {
      await deleteDeck();
    } catch (error) {
      console.error('Failed to delete deck', error);
    }
  };

  return (
    <div>
      {/* Delete Button */}
      <Button variant="danger" onClick={() => setShowModal(true)}>
        Delete Deck
      </Button>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the deck <strong>{deckName}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteDeck;
