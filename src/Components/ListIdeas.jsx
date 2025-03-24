import { useContext } from 'react';
import DataContext from '../Contexts/Data';
import '../Style/idea.scss';

export default function ListIdeas({ idea }) {
    const { getDonationsByIdeaId } = useContext(DataContext);

    // Nukreipiame į idėjos informacijos puslapį
    const goToIdeaDetails = () => {
        window.location.hash = `#idea/${idea.id}`;
    };

    // Skaičiuojame progresą (kiek procentų lėšų jau surinkta)
    const progress = ((idea.raised / idea.goal) * 100).toFixed(2);

    // Skaičiuojame "Liko surinkti" sumą, neleidžiame būti neigiamai
    const remainingAmount = Math.max(0, idea.goal - idea.raised);

    return (
        <div className={`idea ${idea.status === 'completed' ? 'completed' : ''}`} onClick={goToIdeaDetails}>
            {/* Paveikslėlis, jei jis yra */}
            {idea.image && (
                <div className="idea-image">
                    <img src={idea.image} alt={idea.title} />
                </div>
            )}
            <div className="idea-content">
                <h2>{idea.title}</h2>
                <p><strong>Autorius:</strong> {idea.creatorName}</p>
                <p>{idea.description}</p>
                <p><strong>Tikslas:</strong> {idea.goal} €</p>
                <p><strong>Surinkta:</strong> {idea.raised} €</p>
                <p><strong>Liko surinkti:</strong> {remainingAmount} €</p>

                {/* Progreso juosta */}
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>

                {/* Užrašas "Tikslas pasiektas!" */}
                {idea.status === 'completed' && (
                    <p className="goal-reached">Tikslas pasiektas!</p>
                )}
            </div>
        </div>
    );
}