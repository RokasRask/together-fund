import { createContext, useEffect, useState } from 'react';
import Wrapper from '../Components/Wrapper';
import Page404 from '../Components/Page404';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import IdeaDetails from '../Pages/IdeaDetails';
import Logout from '../Pages/Logout';
import Register from '../Pages/Register';
import CreateIdea from '../Pages/CreateIdea';
import UnapprovedIdeas from '../Pages/UnapprovedIdeas';
import Contacts from '../Pages/Contacts';
import AllIdeas from '../Pages/AllIdeas';

const RouterContext = createContext();

export const Router = ({ children }) => {
    
    const showComponentsList = {
        error404: <Page404 />
    };

    const routes = {
        '': { c: <Home />, title: 'Home', params: 0 },
        'home': { c: <Home />, title: 'Home', params: 0 },
        'login': { c: <Login />, title: 'Login', params: 0, hideNav: true },
        'register': { c: <Register />, title: 'Register', params: 0, hideNav: true },
        'logout': {c: <Logout/>, title: 'Logout', params: 0, hideNav: true},
        'create_idea': { c: <CreateIdea />, title: 'Create Idea', params: 0 },
        'all_ideas': { c: <AllIdeas />, title: 'All ideas', params: 0 },
        'unapproved_ideas': { c: <UnapprovedIdeas />, title: 'Unapproved Ideas', params: 0 },
        'idea': { c: <IdeaDetails />, title: 'Idea Details', params: 1 },
        'contacts': { c: <Contacts />, title: 'Contacts', params: 0 }
    };

    const [page, setPage] = useState(() => {
        let hash = window.location.hash.replace('#', '');
        hash = hash.split('/').shift();
        console.log('Pradinis STATE page:', hash);
        return hash;
    });

    const [parameters, setParameters] = useState(() => {
        let hash = window.location.hash.replace('#', '');
        hash = hash.split('/');
        hash.shift();
        console.log('Pradinis STATE parameters:', hash);
        return hash;
    });

    // Būsena: rodyti komponentą
    const [showComponent, setShowComponent] = useState(null);

    useEffect(() => {
        const handleHashChange = () => {
            let hash = window.location.hash.replace('#', '');
            hash = hash.split('/');
            const newPage = hash.shift();
            setPage(newPage);
            setParameters(hash);

            if (!routes[newPage]) {
                setShowComponent('error404');
            } else {
                setShowComponent(null);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Atnaujiname rodymą, kai keičiasi puslapis ar parametrai
    useEffect(() => {
        if (!routes[page]) {
            setShowComponent('error404'); // Jei puslapis neegzistuoja, rodome 404
        } else {
            setShowComponent(null);
        }
        console.log('useEffect ROUTER [page, parameters]');
    }, [page, parameters]);

    return (
        <RouterContext.Provider value={{
            page,
            parameters,
            setShowComponent,
            routes
        }}>
            {showComponent === null ? children : <Wrapper>{showComponentsList[showComponent] ?? null}</Wrapper>}
            {console.log('Renderinamas ROUTER su page:', page)}
        </RouterContext.Provider>
    );
};

export default RouterContext;