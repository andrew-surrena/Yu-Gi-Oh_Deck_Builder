import React from 'react';
import { useMutation } from '@apollo/client';
import { Button } from 'react-bootstrap';
import { DELETE_CARD_FROM_USER } from '../utils/mutations'; // Update the path if needed

interface RemoveCardProps {
  cardId: string;
  onCardRemoved?: () => void; // Optional callback to handle UI updates after removal
}

const RemoveCardFromCollection: React.FC<RemoveCardProps> = ({ cardId, onCardRemoved }) => {
  const [deleteCardFromUser, { loading, error }] = useMutation(DELETE_CARD_FROM_USER);

  const handleRemoveCard = async () => {
    try {
        // console.log("this is the card Id:", cardId);
        
      const { data } = await deleteCardFromUser({
        variables: { cardId },
      });

      if (data) {
        // console.log(`Card with ID ${cardId} removed from collection`);
        // Trigger any callback to update the UI
        if (onCardRemoved) {
          onCardRemoved();
        }
      }
    } catch (err) {
      console.error('Error removing card from collection:', err);
    }
  };

  return (
    <div className="text-center">
      <Button
        variant="danger"
        onClick={handleRemoveCard}
        disabled={loading}
        className="my-2"
      >
        {loading ? 'Removing...' : 'Remove Card'}
      </Button>
      {error && <p className="text-danger mt-2">Error: {error.message}</p>}
    </div>
  );
};

export default RemoveCardFromCollection;
