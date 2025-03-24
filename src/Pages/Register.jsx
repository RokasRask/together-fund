import { useState } from 'react';
import useRegister from '../Hooks/useRegister';
import { toast } from 'react-toastify';
import '../Style/loginRegister.scss';
import Link from '../Components/Link';

export default function Register() {
    const { setRegisterData } = useRegister();

    const goHome = () => {
        window.location.hash = '#';
    };

    const goToLogin = () => {
        window.location.hash = '#login';
    };

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const changeHandler = (e) => {
        setForm(f => ({
            ...f,
            [e.target.id]: e.target.value
        }));
    };

    const validateForm = () => {
        let isValid = true;

        // Tikriname vardą
        if (form.name.trim() === '') {
            toast.error('Vardas yra privalomas');
            isValid = false;
        }

        // Tikriname el. paštą
        if (!form.email.includes('@')) {
            toast.error('Įveskite teisingą el. paštą');
            isValid = false;
        }

        // Tikriname slaptažodžius
        if (form.password.trim() === '') {
            toast.error('Slaptažodis yra privalomas');
            isValid = false;
        }

        if (form.password !== form.confirmPassword) {
            toast.error('Slaptažodžiai nesutampa');
            isValid = false;
        }

        return isValid;
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setRegisterData(form)
                .then(response => {
                    if (response.success) {
                        toast.success('Registracija sėkminga! Galite prisijungti.');
                        goToLogin();
                    }
                })
                .catch(error => {
                    toast.error('Registracija nepavyko: ' + (error.response?.data?.error || 'Klaida'));
                });
        }
    };

    return (
        <section className="register-container">
            <div className="register-box">
                <div className="register-header">
                    <span>Registruotis</span>
                </div>
                <form onSubmit={submitHandler}>
                    <div className="register-input-group">
                        <i className="fas fa-user"></i>
                        <input type="text" id="name" placeholder="Vardas" onChange={changeHandler} value={form.name} />
                    </div>
                    <div className="register-input-group">
                        <i className="fas fa-envelope"></i>
                        <input type="text" id="email" placeholder="El. paštas" onChange={changeHandler} value={form.email} />
                    </div>
                    <div className="register-input-group">
                        <i className="fas fa-lock"></i>
                        <input type="password" id="password" placeholder="Slaptažodis" onChange={changeHandler} value={form.password} />
                    </div>
                    <div className="register-input-group">
                        <i className="fas fa-lock"></i>
                        <input type="password" id="confirmPassword" placeholder="Pakartokite slaptažodį" onChange={changeHandler} value={form.confirmPassword} />
                    </div>
                    <div className="register-button-group">
                        <button type="submit" className="register-button">Registruotis</button>
                        <button type="button" className="register-cancel-button" onClick={goHome}>Atšaukti</button>
                    </div>
                    <div className="register-login-link">
                        <span>Jau turite paskyrą? </span>
                        <Link to="login">Prisijungti</Link>
                    </div>
                </form>
            </div>
        </section>
    );
}