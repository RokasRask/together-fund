import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../Contexts/Auth';
import '../Style/createIdea.scss';

export default function CreateIdea() {
    const { user } = useContext(AuthContext); // Gauname vartotojo duomenis
    const [form, setForm] = useState({
        title: '',
        description: '',
        image: null, // Nuotrauka kaip failas
        goal: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        // Jei vartotojas yra svečias, nukreipiame jį į prisijungimo puslapį
        if (user?.role === 'guest') {
            window.location.hash = '#login';
        }
    }, [user]);

    // Jei vartotojas yra svečias, nieko nerodome (bus nukreiptas į login)
    if (user?.role === 'guest') {
        return null;
    }

    const changeHandler = (e) => {
        const { id, value, files } = e.target;
        if (id === 'image' && files && files[0]) {
            const file = files[0];
            // Patikriname failo dydį (maks 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Nuotrauka per didelė! Maksimalus dydis - 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                // Nustatome peržiūros URL animacijai
                setPreviewUrl(reader.result);
                // Nustatome nuotrauką formos būsenoje
                setForm(f => ({
                    ...f,
                    image: reader.result // Base64 užkoduota nuotrauka
                }));
            };
            reader.readAsDataURL(file); // Konvertuojame failą į base64
        } else {
            setForm(f => ({
                ...f,
                [id]: value
            }));
        }
    };

    const validateForm = () => {
        if (!form.title.trim()) {
            toast.error('Įveskite idėjos pavadinimą');
            return false;
        }
        if (!form.description.trim()) {
            toast.error('Įveskite idėjos aprašymą');
            return false;
        }
        if (!form.goal || isNaN(form.goal) || parseFloat(form.goal) <= 0) {
            toast.error('Įveskite teisingą tikslinę sumą (skaičius didesnis už 0)');
            return false;
        }
        return true;
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validacija
        if (!validateForm()) {
            return; // Jei forma neteisinga, nutraukiame vykdymą
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/v1/ideas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...form,
                    createdBy: user.id, // Pridedame vartotojo ID
                    status: 'inactive' // Statusas visada 'inactive'
                }),
                credentials: 'include' // Siunčiame slapukus
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Idėja sėkmingai sukurta! Ji bus rodoma po administratoriaus patvirtinimo.');
                // Išvalome formą
                setForm({
                    title: '',
                    description: '',
                    image: null,
                    goal: ''
                });
                setPreviewUrl(null);
                
                // Nukreipiame į pagrindinį puslapį po 2 sekundžių
                setTimeout(() => {
                    window.location.hash = '#';
                }, 2000);
            } else {
                toast.error('Klaida: ' + (data.error || 'Nepavyko sukurti idėjos'));
            }
        } catch (error) {
            console.error('Klaida siunčiant duomenis:', error);
            toast.error('Įvyko klaida bandant sukurti idėją');
        } finally {
            setIsLoading(false);
        }
    };

    const cancelHandler = () => {
        // Parodome patvirtinimo dialogą
        if (form.title || form.description || form.image || form.goal) {
            if (window.confirm('Ar tikrai norite atšaukti? Visi įvesti duomenys bus prarasti.')) {
                window.location.hash = '#';
            }
        } else {
            window.location.hash = '#';
        }
    };

    return (
        <section className="create-idea">
            <div className="container">
                <h1>Sukurti naują idėją</h1>
                <p className="info-text">
                    Sukurkite savo idėją ir dalinkitės ja su kitais! Jūsų idėja bus peržiūrėta administratoriaus
                    ir, kai bus patvirtinta, bus matoma visiems vartotojams.
                </p>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="title">Pavadinimas</label>
                        <input
                            type="text"
                            id="title"
                            onChange={changeHandler}
                            value={form.title}
                            placeholder="Įveskite idėjos pavadinimą"
                            disabled={isLoading}
                            maxLength={100}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Aprašymas</label>
                        <textarea
                            id="description"
                            onChange={changeHandler}
                            value={form.description}
                            placeholder="Aprašykite savo idėją"
                            disabled={isLoading}
                            maxLength={2000}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Nuotrauka</label>
                        <input
                            type="file"
                            id="image"
                            onChange={changeHandler}
                            accept="image/*" // Priimame tik paveikslėlius
                            disabled={isLoading}
                        />
                        {previewUrl && (
                            <div className="image-preview-container">
                                <img
                                    src={previewUrl}
                                    alt="Pasirinkta nuotrauka"
                                    className="image-preview"
                                />
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="goal">Tikslinė suma (€)</label>
                        <input
                            type="number"
                            id="goal"
                            onChange={changeHandler}
                            value={form.goal}
                            placeholder="Įveskite norimą surinkti sumą"
                            disabled={isLoading}
                            min="1"
                            step="0.01"
                        />
                    </div>
                    <div className="buttons">
                        <button 
                            type="submit" 
                            className={`yellow ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Kuriama...' : 'Sukurti idėją'}
                        </button>
                        <button 
                            type="button" 
                            className="blue" 
                            onClick={cancelHandler}
                            disabled={isLoading}
                        >
                            Atšaukti
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}