import { useContext, useEffect, useRef } from 'react';
import DataContext from '../Contexts/Data';
import ListIdeas from '../Components/ListIdeas';
import '../Style/all-ideas.scss';

export default function AllIdeas() {
    const { ideas, fetchIdeas } = useContext(DataContext);
    const containerRef = useRef(null);

    // Kiekvieną kartą patekęs į Home puslapį, iš naujo užkrauname idėjas
    useEffect(() => {
        fetchIdeas();
    }, [fetchIdeas]);

    // Pridedame subtilų parallax efektą
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            containerRef.current.style.transform = `translateX(${x * 10 - 5}px) translateY(${y * 10 - 5}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Filtruojame ir rūšiuojame idėjas
    const activeIdeas = ideas?.filter(idea => idea.status === 'active');
    const completedIdeas = ideas?.filter(idea => idea.status === 'completed');

    // Funkcija sukuria slankiojančius objektus fone
    const renderFloatingObjects = () => {
        return (
            <div className="floating-objects">
                {[...Array(15)].map((_, index) => (
                    <div key={index} className="object"></div>
                ))}
            </div>
        );
    };

    return (
        <section className="all-ideas">
            {renderFloatingObjects()}
            
            <div className="container" ref={containerRef}>
                {ideas !== null ? (
                    <>
                        {/* Rodyti "active" idėjas */}
                        {activeIdeas?.length > 0 && (
                            <>
                                <h2>Aktyvios idėjos</h2>
                                {activeIdeas.map(idea => (
                                    <ListIdeas key={idea.id} idea={idea} />
                                ))}
                            </>
                        )}

                        {/* Rodyti "completed" idėjas */}
                        {completedIdeas?.length > 0 && (
                            <>
                                <h2>Įgyvendintos idėjos</h2>
                                {completedIdeas.map(idea => (
                                    <ListIdeas key={idea.id} idea={idea} />
                                ))}
                            </>
                        )}

                        {/* Jei nėra idėjų */}
                        {(activeIdeas?.length === 0 && completedIdeas?.length === 0) && (
                            <p>Nėra idėjų.</p>
                        )}
                    </>
                ) : (
                    <h2>Kraunamos idėjos</h2>
                )}
            </div>
        </section>
    );
}