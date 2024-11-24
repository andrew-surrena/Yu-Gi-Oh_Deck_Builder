import { jwtDecode, JwtPayload } from "jwt-decode";

interface ExtendedJwt extends JwtPayload {
    data: {
        username: string,
        _id: string, // Add user ID here
        exp: number,
    }
}

class AuthService {
    getProfile() {
        return jwtDecode<ExtendedJwt>(this.getToken());
    }

    getUsername() {
        const token = this.getToken();
        // console.log('Token:', token); // Debugging
        if (!token) return null;

        const decoded = jwtDecode<ExtendedJwt>(token);
        // console.log('Decoded JWT:', decoded); // Debugging
        return decoded?.data?.username || null;
    }

    // New method to get user ID from token
    getUserId() {
        const token = this.getToken();
        // console.log('Token:', token); // Debugging
        if (!token) return null;

        const decoded = jwtDecode<ExtendedJwt>(token);
        // console.log('Decoded JWT:', decoded); // Debugging
        return decoded?.data?._id || null; // Extract user ID
    }

    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token: string) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);

            if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
                return true;
            }
        } catch (error) {
            return false;
        }
    }

    getToken(): string {
        const loggedUser = localStorage.getItem('id_token') || '';
        return loggedUser;
    }

    login(idToken: string) {
        localStorage.setItem('id_token', idToken);
        window.location.assign('/Profile');
    }

    logout() {
        localStorage.removeItem('id_token');
        window.location.assign('/');
    }
}

export default new AuthService();
