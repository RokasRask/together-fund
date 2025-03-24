import axios from 'axios';
import { useEffect, useContext } from 'react';
import { serverUrl } from '../Constants/main';
import AuthContext from '../Contexts/Auth';
import { toast } from 'react-toastify';

export default function useLogin() {
    const redirectAfterLogin = () => {
        window.location.hash = '#';
    };

    const { setUser } = useContext(AuthContext);

    const loginUser = async (data) => {
        try {
            const response = await axios.post(serverUrl + 'login', data, { withCredentials: true });
            setUser(response.data.user);
            toast.success('Sėkmingai prisijungta!'); // Pranešimas apie sėkmingą prisijungimą
            redirectAfterLogin();
            return response.data; // Grąžiname atsakymą iš serverio
        } catch (error) {
            console.error(error);
            throw error; // Perduodame klaidą toliau
        }
    };

    return { setLoginData: loginUser }; // Grąžiname prisijungimo funkciją
}