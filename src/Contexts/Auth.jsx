import { createContext, useEffect, useState } from 'react';
import { serverUrl } from '../Constants/main';
import axios from 'axios';

const AuthContext = createContext();


export const Auth = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(_ => {
        axios.get(serverUrl + 'auth', { withCredentials: true })
            .then(res => {

                setUser(res.data);
            })
            .catch(error => {
                console.error(error);
            })
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            setUser

        }}>
            {user === null ? <div className='loader-container'>
                <div class="loader"></div>
            </div> : children}
        </AuthContext.Provider>
    );
}

export default AuthContext;