import { useState } from 'react';
import { toast } from 'react-toastify';
import '../Style/contacts.scss';

export default function Contacts() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    });

    const changeHandler = (e) => {
        const { id, value } = e.target;
        setForm(f => ({
            ...f,
            [id]: value
        }));
    };

    const validateForm = () => {
        if (!form.name.trim()) {
            toast.error('Įveskite savo vardą');
            return false;
        }
        if (!form.email.includes('@')) {
            toast.error('Įveskite teisingą el. paštą');
            return false;
        }
        if (!form.message.trim()) {
            toast.error('Įveskite žinutę');
            return false;
        }
        return true;
    };

    const submitHandler = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Čia galėtumėte pridėti kodą, kuris siųstų formos duomenis į serverį
            toast.success('Žinutė sėkmingai išsiųsta!');
            setForm({
                name: '',
                email: '',
                message: ''
            });
        }
    };

    return (
        <section className="contacts">
            <div className="container">
                <h1>Susisiekite su mumis</h1>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label htmlFor="name">Vardas</label>
                        <input
                            type="text"
                            id="name"
                            onChange={changeHandler}
                            value={form.name}
                            placeholder="Įveskite savo vardą"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">El. paštas</label>
                        <input
                            type="email"
                            id="email"
                            onChange={changeHandler}
                            value={form.email}
                            placeholder="Įveskite savo el. paštą"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Žinutė</label>
                        <textarea
                            id="message"
                            onChange={changeHandler}
                            value={form.message}
                            placeholder="Įveskite savo žinutę"
                            rows="5"
                        />
                    </div>
                    <div className="buttons">
                        <button type="submit" className="yellow">Siųsti žinutę</button>
                        <button type="button" className="blue" onClick={() => setForm({ name: '', email: '', message: '' })}>
                            Išvalyti
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}