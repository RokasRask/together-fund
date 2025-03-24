import { useEffect, useReducer } from 'react';
import ideasReducer from '../Reducers/ideasReducer';
import { serverUrl } from '../Constants/main';
import axios from 'axios';
import * as A from '../Constants/actions';

export default function useIdeas() {
    const [ideas, dispatchIdeas] = useReducer(ideasReducer, null);

    const fetchIdeas = async () => {
        try {
            const response = await axios.get(serverUrl + 'ideas');
            dispatchIdeas({
                type: A.LOAD_ALL_IDEAS,
                payload: response.data
            });
        } catch (error) {
            console.error('Klaida gaunant idėjas:', error);
        }
    };

    // Pirmą kartą užkrauname idėjas
    useEffect(() => {
        fetchIdeas();
    }, []);

    return { ideas, fetchIdeas }; // Grąžiname idėjas ir fetchIdeas funkciją
}