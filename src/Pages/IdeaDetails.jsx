import { useContext, useEffect, useState } from 'react';
import DataContext from '../Contexts/Data';
import RouterContext from '../Contexts/Router';
import ListDonations from '../Components/ListDonations';
import Modal from '../Components/Modal';
import { toast } from 'react-toastify';
import '../Style/ideaDetails.scss';

export default function IdeaDetails() {
    const { parameters } = useContext(RouterContext);
    const { getDonationsByIdeaId, donations, fetchIdeas } = useContext(DataContext);
    const [idea, setIdea] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [donationForm, setDonationForm] = useState({
        donorName: '',
        amount: ''
    });

    const ideaId = parameters[0];

    useEffect(() => {
        const fetchIdea = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:3001/api/v1/ideas/${ideaId}`);
                const data = await response.json();
                setIdea(data);
            } catch (error) {
                console.error('Klaida gaunant idėją:', error);
                toast.error('Nepavyko užkrauti idėjos informacijos');
            } finally {
                setIsLoading(false);
            }
        };

        fetchIdea();
    }, [ideaId]);

    useEffect(() => {
        if (getDonationsByIdeaId) {
            getDonationsByIdeaId(ideaId);
        }
    }, [ideaId, getDonationsByIdeaId]);

    const handleDonationFormChange = (e) => {
        const { id, value } = e.target;
        setDonationForm(f => ({
            ...f,
            [id]: value
        }));
    };

    const validateDonationForm = () => {
        if (!donationForm.donorName.trim()) {
            toast.error('Prašome įvesti savo vardą');
            return false;
        }
        if (!donationForm.amount || isNaN(donationForm.amount) || parseFloat(donationForm.amount) <= 0) {
            toast.error('Prašome įvesti teisingą sumą');
            return false;
        }
        return true;
    };

    const handleDonate = async () => {
        if (!validateDonationForm()) return;

        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:3001/api/v1/donations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idea_id: ideaId,
                    donor_name: donationForm.donorName,
                    amount: parseFloat(donationForm.amount)
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Auka sėkmingai pridėta!');
                setIsModalOpen(false);
                setDonationForm({ donorName: '', amount: '' });
                
                if (getDonationsByIdeaId) {
                    getDonationsByIdeaId(ideaId);
                }
                
                if (fetchIdeas) {
                    fetchIdeas();
                }

                const ideaResponse = await fetch(`http://localhost:3001/api/v1/ideas/${ideaId}`);
                const ideaData = await ideaResponse.json();
                setIdea(ideaData);
                
                // Show special celebration if goal is reached
                if (ideaData.status === 'completed' && idea.status !== 'completed') {
                    toast.success('🎉 Sveikiname! Idėjos tikslas pasiektas!', {
                        autoClose: 5000,
                        hideProgressBar: false,
                    });
                }
            } else {
                toast.error('Klaida: ' + (data.error || 'Nepavyko pridėti aukos'));
            }
        } catch (error) {
            console.error('Klaida siunčiant auką:', error);
            toast.error('Įvyko klaida bandant pridėti auką');
        } finally {
            setIsLoading(false);
        }
    };

    if (!idea) {
        return (
            <section className="idea-details">
                <div className="container">
                    <p>Kraunama...</p>
                </div>
            </section>
        );
    }

    const progress = ((idea.raised / idea.goal) * 100).toFixed(2);
    const remainingAmount = Math.max(0, idea.goal - idea.raised);

    return (
        <section className={`idea-details ${idea.status === 'completed' ? 'completed' : 'active'}`}>
            {idea.status === 'completed' && (
                <div className="goal-reached-badge">Tikslas pasiektas! 🎉</div>
            )}
            
            <div className="container">
                <div className="idea-content-wrapper">
                    {idea.image && (
                        <div className="idea-image">
                            <img src={idea.image} alt={idea.title} />
                        </div>
                    )}
                    <div className="idea-content">
                        <h1>{idea.title}</h1>
                        <p><strong>Autorius:</strong> {idea.creatorName}</p>
                        <p>{idea.description}</p>
                        <p><strong>Tikslas:</strong> {idea.goal} €</p>
                        <p><strong>Surinkta:</strong> {idea.raised} €</p>
                        <p><strong>Liko surinkti:</strong> {remainingAmount} €</p>

                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${progress}%` }}></div>
                        </div>

                        {idea.status === 'active' && (
                            <button 
                                className="donate-button" 
                                onClick={() => setIsModalOpen(true)}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Apdorojama...' : 'Aukoti'}
                            </button>
                        )}
                    </div>
                </div>

                <h2>Aukos:</h2>
                {donations && donations.length > 0 ? (
                    <ListDonations donations={donations} />
                ) : (
                    <p>Kol kas nėra aukų. Būkite pirmas!</p>
                )}

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2>Aukoti idėjai: {idea.title}</h2>
                    <div className="form-group">
                        <label htmlFor="donorName">Jūsų vardas</label>
                        <input
                            type="text"
                            id="donorName"
                            value={donationForm.donorName}
                            onChange={handleDonationFormChange}
                            placeholder="Įveskite savo vardą"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Suma (€)</label>
                        <input
                            type="number"
                            id="amount"
                            value={donationForm.amount}
                            onChange={handleDonationFormChange}
                            placeholder="Įveskite sumą"
                            min="0.01"
                            step="0.01"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button 
                            className="donate-button" 
                            onClick={handleDonate}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Apdorojama...' : 'Aukoti'}
                        </button>
                        <button 
                            className="cancel-button" 
                            onClick={() => setIsModalOpen(false)}
                            disabled={isLoading}
                        >
                            Atšaukti
                        </button>
                    </div>
                </Modal>
            </div>
        </section>
    );
}