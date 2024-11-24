import { Container } from 'react-bootstrap';
import { Button, Card, Pagination } from "antd";
import { Decks } from '../interfaces/Deck';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_GETALLDECKS } from '../utils/queries';
import DeckList from '../components/DeckLayout';
import Auth from "../utils/auth";
import { Link } from "react-router-dom";
import CreateDeck from "../components/CreateDeck";

const DeckPage: React.FC = () => {
    const [decks, setDecks] = useState<Decks[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentCardsPer, setCardsPer] = useState(6);

    const username = Auth.getUsername();

    const { data: deckDataQuery, loading: deckLoading } = useQuery(QUERY_GETALLDECKS, {
      variables: {username}
    });

    useEffect(() => {
        if (deckDataQuery) {
            // console.log('Deck Data Query:', deckDataQuery);
            setDecks(deckDataQuery?.user.allDecks || []);
        }
    }, [deckDataQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, []);

    if (deckLoading) return <p>Loading...</p>;
    // if (deckError) return <p>Error loading deck data: {deckError.message}</p>;

    const lastIndex = currentPage * currentCardsPer;
    const firstIndex = lastIndex - currentCardsPer;
    const currentDecks = decks.slice(firstIndex, lastIndex);

    const onPageChange = (page: number, size: number) => {
        setCurrentPage(page);
        setCardsPer(size);
    };

      // Check if user is logged in
  const isLoggedIn = Auth.loggedIn(); // Assuming this method returns true/false

  if (!isLoggedIn) {
    return (
      <div className="containerPage">
        <Card
          style={{
            width: 400,
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f0f2f5",
          }}
        ><h2 style={{color: "yellow", background: "black", borderRadius: "10px",}}>Whoah! You've gone BANANAS! Please log in before viewing saved decks 🍌</h2>
          <iframe
            src="https://giphy.com/embed/H8uuXYln5pxVVLFn7k"
            height="270"
            frameBorder="0"
            allowFullScreen
            title="Bananas GIF"
            style={{ marginBottom: "16px", width: "100%" }}
          ></iframe>
          <Link to="/">
            <Button type="primary">Go to Login Page</Button>
          </Link>
        </Card>
      </div>
    );
  }  
  return (
        <Container>
            <h2 style={{background: "white", display: "flex", justifyContent:"center"}}>
                {decks.length
                    ? `You have ${decks.length} deck(s):`
                    : `Please create a deck first!`}
            </h2>
<CreateDeck></CreateDeck>
            <DeckList decks={currentDecks} />

            <div className="d-flex justify-content-center mt-4 mb-4 pagination-container">
                <Pagination
                    hideOnSinglePage={true}
                    pageSize={currentCardsPer}
                    total={decks.length} // Total items, not pages
                    current={currentPage}
                    showSizeChanger={true}
                    pageSizeOptions={['6', '12', '18', '24']}
                    onChange={onPageChange}
                    size={'default'}
                />
            </div>
        </Container>
    );
};

export default DeckPage;
