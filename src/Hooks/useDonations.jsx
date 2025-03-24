// import { useState } from 'react';
// import { serverUrl } from '../Constants/main';
// import axios from 'axios';

// export default function useDonations() {
//     const [donations, setDonations] = useState([]);

//     // Funkcija, kuri gauna aukas pagal idėjos ID
//     const getDonationsByIdeaId = async (ideaId) => {
//         try {
//             const response = await axios.get(serverUrl + 'donations/' + ideaId);
//             console.log('Ateina atsakymas iš serverio į useDonations:', response.data);
//             setDonations(response.data);
//         } catch (error) {
//             console.error('Klaida gaunant aukas:', error);
//         }
//     };

//     return { donations, getDonationsByIdeaId };
// }

import { useState } from 'react';
import { serverUrl } from '../Constants/main';
import axios from 'axios';

export default function useDonations(fetchIdeas) { // Pridedame fetchIdeas kaip parametrą
    const [donations, setDonations] = useState([]);

    // Pridėti naują auką
    const addDonation = async (idea_id, donor_name, amount) => {
        try {
            const response = await axios.post(serverUrl + 'donations', {
                idea_id,
                donor_name,
                amount
            });
            fetchIdeas(); // Atnaujiname idėjų sąrašą po aukos pridėjimo
            return response.data;
        } catch (error) {
            console.error('Klaida pridedant auką:', error);
            throw error;
        }
    };

    // Gauti aukas pagal idėjos ID
    const getDonationsByIdeaId = async (ideaId) => {
        try {
            const response = await axios.get(serverUrl + 'donations/' + ideaId);
            setDonations(response.data);
        } catch (error) {
            console.error('Klaida gaunant aukas:', error);
        }
    };

    return { donations, getDonationsByIdeaId, addDonation };
}