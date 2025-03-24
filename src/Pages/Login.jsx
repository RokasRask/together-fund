import { useState } from 'react';
import useLogin from '../Hooks/useLogin';
import { toast } from 'react-toastify';
import '../Style/loginRegister.scss';
import Link from '../Components/Link';

export default function Login() {
    const { setLoginData } = useLogin();

    const goHome = () => {
        window.location.hash = '#';
    };

    const [form, setForm] = useState({
        name: '',
        password: ''
    });

    const changeHandler = (e) => {
        setForm(f => ({
            ...f,
            [e.target.id]: e.target.value
        }));
    };

    const submitHandler = (e) => {
        e.preventDefault();

        if (form.name && form.password) {
            setLoginData(form)
                .then(() => {
                    goHome();
                })
                .catch(error => {
                    if (error.response?.data?.error === 'Vartotojas nerastas') {
                        toast.error('Vartotojas su tokiu vardu nerastas');
                        setForm({ name: '', password: '' });
                    } else if (error.response?.data?.error === 'Neteisingas slaptažodis') {
                        toast.error('Neteisingas slaptažodis');
                        setForm(f => ({ ...f, password: '' }));
                    } else {
                        toast.error('Prisijungimo klaida: ' + (error.response?.data?.error || 'Bandykite dar kartą'));
                    }
                });
        } else {
            toast.error('Prašome užpildyti visus laukelius');
        }
    };

    return (
        <section className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <span>Prisijungti</span>
                </div>
                <form onSubmit={submitHandler}>
                    <div className="login-input-group">
                        <i className="fas fa-user"></i>
                        <input type="text" id="name" placeholder="Vardas" onChange={changeHandler} value={form.name} />
                    </div>
                    <div className="login-input-group">
                        <i className="fas fa-lock"></i>
                        <input type="password" id="password" placeholder="Slaptažodis" onChange={changeHandler} value={form.password} />
                    </div>
                    
                    <div className="login-button-group">
                        <button type="submit" className="login-button">Prisijungti</button>
                        <button type="button" className="login-cancel-button" onClick={goHome}>Atšaukti</button>
                    </div>
                    <div className="login-register-link">
                        <span>Neturite paskyros? </span>
                        <Link to="register">Užsiregistruoti</Link>
                    </div>
                </form>
            </div>
        </section>
    );
}