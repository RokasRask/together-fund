import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { serverUrl } from '../Constants/main';
import AuthContext from '../Contexts/Auth';
import { toast } from 'react-toastify';

export default function useRegister() {
    const redirectAfterRegister = () => {
        window.location.hash = '#login'; // Nukreipiame į prisijungimo puslapį po sėkmingos registracijos
    };

    const { setUser } = useContext(AuthContext);
    const [registerData, setRegisterData] = useState(null);

    const registerUser = async (data) => {
        try {
            const response = await axios.post(serverUrl + 'register', data, { withCredentials: true });
            return response.data; // Grąžiname atsakymą iš serverio
        } catch (error) {
            console.error(error);
            throw error; // Perduodame klaidą toliau
        }
    };

    useEffect(() => {
        if (registerData === null) {
            return;
        }

        registerUser(registerData)
            .then(response => {
                if (response.success) {
                    toast.success('Registracija sėkminga! Galite prisijungti.');
                    redirectAfterRegister();
                }
            })
            .catch(error => {
                toast.error('Registracija nepavyko: ' + (error.response?.data?.error || 'Klaida'));
            });
    }, [registerData]);

    return { setRegisterData: registerUser }; // Grąžiname registracijos funkciją
}