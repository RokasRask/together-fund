import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../Contexts/Auth';
import ListIdeas from '../Components/ListIdeas';
import Modal from '../Components/Modal';
import '../Style/unapprovedIdeas.scss';

export default function UnapprovedIdeas() {
    const { user } = useContext(AuthContext); // Gauname vartotojo duomenis
    const [unapprovedIdeas, setUnapprovedIdeas] = useState([]); // Nepatvirtintos idėjos
    const [selectedIdea, setSelectedIdea] = useState(null); // Pasirinkta idėja patvirtinimui
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal lango būsena

    // Jei vartotojas nėra administratorius, nukreipiame jį į pagrindinį puslapį
    useEffect(() => {
        if (user?.role !== 'admin') {
            window.location.hash = '#';
        }
    }, [user]);

    // Gauname nepatvirtintas idėjas
    useEffect(() => {
        const fetchUnapprovedIdeas = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/v1/unapproved_ideas', {
                    credentials: 'include'
                });
                const data = await response.json();

                if (response.ok) {
                    setUnapprovedIdeas(data); // Nustatome nepatvirtintas idėjas
                } else {
                    toast.error('Klaida gaunant nepatvirtintas idėjas: ' + (data.error || 'Bandykite dar kartą'));
                }
            } catch (error) {
                console.error('Klaida gaunant nepatvirtintas idėjas:', error);
                toast.error('Įvyko klaida bandant gauti nepatvirtintas idėjas');
            }
        };

        if (user?.role === 'admin') {
            fetchUnapprovedIdeas();
        }
    }, [user]);

    // Patvirtinimo funkcija
    const approveIdea = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/v1/ideas/${selectedIdea.id}/approve`, {
                method: 'PUT',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Idėja sėkmingai patvirtinta!');
                setUnapprovedIdeas(prev => prev.filter(idea => idea.id !== selectedIdea.id)); // Pašaliname patvirtintą idėją iš sąrašo
                setIsModalOpen(false); // Uždarome modal langą
            } else {
                toast.error('Klaida: ' + (data.error || 'Nepavyko patvirtinti idėjos'));
            }
        } catch (error) {
            console.error('Klaida patvirtinant idėją:', error);
            toast.error('Įvyko klaida bandant patvirtinti idėją');
        }
    };

    return (
        <section className="unapproved-ideas">
            <div className="container">
                <h1>Nepatvirtintos idėjos</h1>
                {unapprovedIdeas.length > 0 ? (
                    unapprovedIdeas.map(idea => (
                        <div key={idea.id} className="idea-container">
                            <ListIdeas idea={idea} />
                            <button
                                className="approve-button"
                                onClick={() => {
                                    setSelectedIdea(idea); // Nustatome pasirinktą idėją
                                    setIsModalOpen(true); // Atidarome modal langą
                                }}
                            >
                                Patvirtinti
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Nėra nepatvirtintų idėjų.</p>
                )}

                {/* Modal langas patvirtinimui */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2>Ar tikrai norite patvirtinti šią idėją?</h2>
                    <p>{selectedIdea?.title}</p>
                    <div className="modal-buttons">
                        <button className="yes-button" onClick={approveIdea}>Taip</button>
                        <button className="no-button" onClick={() => setIsModalOpen(false)}>Ne</button>
                    </div>
                </Modal>
            </div>
        </section>
    );
}