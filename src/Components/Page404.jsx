import '../Style/page404.scss';

export default function Page404() {
    const goHome = () => {
        window.location.hash = '#'; // Nukreipiame į pagrindinį puslapį
    };

    return (
        <div className="page404">
            <h1>404</h1>
            <p>Puslapis nerastas</p>
            <button onClick={goHome}>Grįžti į pradinį puslapį</button>
        </div>
    );
}