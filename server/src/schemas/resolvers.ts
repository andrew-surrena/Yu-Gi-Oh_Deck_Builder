import { signToken, AuthenticationError } from '../utils/auth.js';
import User, { IUser } from '../models/user.js';
import Card, { ICard } from '../models/card.js';
import Deck, { IDeck } from '../models/deck.js';
// import { Schema } from 'mongoose';

// todo: finish resolvers and copied the add user and login from activity 28
interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    username: string;
    password: string;
}

interface UserArgs {
    username: string;
}

interface CardArg {
    cardId: string;
}

interface AddCardToDeckArg {
    deckId: string;
    cardId: string;
}

interface AddCardArg {
    input: {
        name: string
        type: string
        description: string
        atk: number
        def: number
        level: number
        attribute: string
        race: string
        archetype: string
        image: string
    }
}

interface DeckArg {
    deckId: string;
}

interface AddDeckArg {
    input: {
        name: string
        playable: boolean
        cards: [string]
        type: string
        user: string
    }
}

// interface DeleteCardFromDeckArg {
//     deckId: Schema.Types.ObjectId
//     cardId: Schema.Types.ObjectId
// }

interface updateDeckArg {
    deckId: string
    input: {
        name: string
        playable: boolean
        type: string
    }
}

const resolvers = {
    Query: {
        user: async (_parent: any, { username }: UserArgs): Promise<IUser | null> => {
            return User.findOne({ username }).populate("savedCards").populate({
                path: 'allDecks',  // Populating the allDecks field
                populate: {
                    path: 'cards',  // Populating the cards field inside each deck
                    model: 'Card',  // Referencing the Card model
                }
            });
        },
        me: async (_parent: any, _args: any, context: any) => {
            // If the user is authenticated, find and return the user's information
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate("savedCards").populate("allDecks");
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Could not authenticate user.');
        },
        allCards: async (): Promise<ICard[] | null> => {
            return Card.find({});
        },
        allDecks: async (): Promise<IDeck[] | null> => {
            return Deck.find({}).populate("cards");
        },
        cardById: async (_parent: any, { cardId }: CardArg) => {
            return await Card.findOne({ _id: cardId });
        },
        deckById: async (_parent: any, { deckId }: DeckArg) => {
            return await Deck.findOne({ _id: deckId }).populate("cards");
        },
    },
    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });

            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);

            // Return the token and the user
            return { token, user };
        },

        login: async (_parent: any, {username, password }: LoginUserArgs) => {
            const user = await User.findOne({ username });

            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },

        addCardToUser: async (_parent: any, { input }: AddCardArg, context: any) => {
            if (context.user) {
                const newCard = await Card.create({ ...input });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedCards: newCard } }
                );

                return newCard;
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },

// note: we switched to $push from $addtoset to have duplicates cards in their deck. For v2 we should consider add to set when we figure out the authenticating the card that exist irl
        addCardToDeck: async (_parent: any, { cardId, deckId }: AddCardToDeckArg, context: any) => {
            if (context.user) {
                // console.log('here is the server cardId:', cardId);
                // console.log('here is the server deckId:', deckId);
                const cardToAdd = await Card.findById(cardId);
                // console.log('here is the server card after findById:', cardToAdd);
                return await Deck.findOneAndUpdate(
                    { _id: deckId },
                    { $push: { cards: cardToAdd, } },
                    { new: true, runValidators: true }
                );
                
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },

        createDeck: async (_parent: any, { input }: AddDeckArg, context: any) => {
            if (context.user) {
                const createNewDeck = await Deck.create({ ...input });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { allDecks: createNewDeck } }
                );
                return createNewDeck;
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },

        // deleteCardFromDeck: async (_parent: any, { deckId, cardId }: DeleteCardFromDeckArg, context: any) => {
        //     if (context.user) {
        //         const deck = await Deck.findById(deckId);
        //             console.log(deck);
        //             if (deck) {
        //         const cardIndex = deck.cards?.findIndex(card => card.equals(cardId));
        //         if (cardIndex) {
        //             deck.cards?.splice(cardIndex,1)
        //         };
        //         const updatedDeck = await deck.save();
        //         return updatedDeck
        //     }}
        //     throw AuthenticationError;
        //     ('You need to be logged in!');
        // },

        updateDeckName: async (_parent: any, { deckId, input }: updateDeckArg, context: any) => {
            if (context.user) {
                return Deck.findOneAndUpdate(
                    { _id: deckId },
                    { name: input.name, playable: input.playable, type: input.type },
                    { new: true });
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },

        deleteCardFromUser: async (_parent: any, { cardId }: CardArg, context: any) => {
            if (context.user) {
                await Card.findOneAndDelete({ _id: cardId });
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull:{ savedCards: cardId }},
                    { new: true }).populate("savedCards").populate("allDecks");
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },
        deleteDeck: async (_parent: any, { deckId }: DeckArg, context: any) => {
            if (context.user) {
                await Deck.findOneAndDelete({ _id: deckId });
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull:{ allDecks: deckId }},
                    { new: true }).populate("savedCards").populate("allDecks");
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },
    }
}

export default resolvers;