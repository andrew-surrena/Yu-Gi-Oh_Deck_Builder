import { signToken, AuthenticationError } from '../utils/auth.js';
import { Card, Deck, User} from '../models/index.js';

// todo: finish resolvers and copied the add user and login from activity 28

const resolvers ={
    Query: {

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

            login: async (_parent: any, { email, password }: LoginUserArgs) => {
                // Find a user with the provided email
                const user = await User.findOne({ email });

                // If no user is found, throw an AuthenticationError
                if (!user) {
                    throw new AuthenticationError('Could not authenticate user.');
                }

                // Check if the provided password is correct
                const correctPw = await user.isCorrectPassword(password);

                // If the password is incorrect, throw an AuthenticationError
                if (!correctPw) {
                    throw new AuthenticationError('Could not authenticate user.');
                }

                // Sign a token with the user's information
                const token = signToken(user.username, user.email, user._id);

                // Return the token and the user
                return { token, user };
            },
    }
}

export default resolvers;