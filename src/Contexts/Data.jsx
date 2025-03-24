import { createContext, useContext, useEffect, useState } from 'react';
import useIdeas from '../Hooks/useIdeas';
import useDonations from '../Hooks/useDonations';
import RouterContext from './Router';

const DataContext = createContext();

export const Data = ({ children }) => {
    const { page, parameters } = useContext(RouterContext);
    const { ideas, fetchIdeas } = useIdeas(); // Gauname fetchIdeas funkciją
    const { donations, getDonationsByIdeaId } = useDonations();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (ideas !== null) {
            setIsLoading(false);
        }
    }, [ideas]);

    return (
        <DataContext.Provider value={{
            ideas,
            donations,
            getDonationsByIdeaId,
            fetchIdeas, // Pateikiame fetchIdeas funkciją
            isLoading
        }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;