import { useContext } from 'react';
import RouterContext from '../Contexts/Router';
import Page404 from './Page404';

export default function Main() {
    const { page, parameters, routes } = useContext(RouterContext);

    console.log('Perkraunamas Main.jsx:', page, parameters);

    const route = () => {
        console.log('Main.jsx renderina:', routes?.[page]?.c.type.name ?? '404');
        return routes?.[page]?.c ?? <Page404 />;
    };

    return (
        <main>
            {route()}
        </main>
    );
}