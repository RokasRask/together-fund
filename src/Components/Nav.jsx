import { useContext, useEffect, useRef, useState } from 'react';
import RouterContext from '../Contexts/Router';
import AuthContext from '../Contexts/Auth';
import Link from './Link';
import '../Style/nav.scss';

export default function Nav() {
    const { page, routes } = useContext(RouterContext);
    const { user } = useContext(AuthContext);
    const hamburgerRef = useRef(null);
    const navbarRef = useRef(null);
    const menubarRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);

    // Handle mobile menu toggle
    useEffect(() => {
        const toggleNav = () => {
            menubarRef.current.classList.toggle("active");
            hamburgerRef.current.classList.toggle("hamburger-active");
            document.body.classList.toggle("menu-open");
        };

        const hamburger = hamburgerRef.current;
        if (hamburger) {
            hamburger.addEventListener("click", toggleNav);
            
            // Cleanup event listener on unmount
            return () => {
                hamburger.removeEventListener("click", toggleNav);
                document.body.classList.remove("menu-open");
            };
        }
    }, []);

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Dinamiškai pridedame .has-navbar klasę body elementui
    useEffect(() => {
        if (!routes[page]?.hideNav) {
            document.body.classList.add('has-navbar');
        } else {
            document.body.classList.remove('has-navbar');
        }
        
        // Cleanup, jei komponentas išmontuojamas
        return () => {
            document.body.classList.remove('has-navbar');
        };
    }, [page, routes]);

    // Close mobile menu when clicking on a link
    const handleLinkClick = () => {
        if (menubarRef.current?.classList.contains('active')) {
            menubarRef.current.classList.remove('active');
            hamburgerRef.current.classList.remove('hamburger-active');
            document.body.classList.remove('menu-open');
        }
    };

    if (routes[page]?.hideNav) {
        return null;
    }

    return (
        <>
            <nav className={scrolled ? 'scrolled' : ''} ref={navbarRef}>
                <div className="nav-container">
                    <div className="logo">
                        <Link to="">
                            <h1>
                                <span className="logo-together">Together</span>
                                <span className="logo-fund">Fund</span>
                            </h1>
                        </Link>
                    </div>
                    
                    <div className="nav-content">
                        <ul className="nav-links">
                            <li className={page === "" ? "active" : ""}>
                                <Link to="" className="nav-link" onClick={handleLinkClick}>
                                    <span className="nav-icon">🏠</span>
                                    <span className="nav-text">Pradinis</span>
                                </Link>
                            </li>
                            <li className={page === "all_ideas" ? "active" : ""}>
                                <Link to="all_ideas" className="nav-link" onClick={handleLinkClick}>
                                    <span className="nav-icon">💡</span>
                                    <span className="nav-text">Visos idėjos</span>
                                </Link>
                            </li>
                            <li className={page === "create_idea" ? "active" : ""}>
                                <Link to="create_idea" className="nav-link" onClick={handleLinkClick}>
                                    <span className="nav-icon">✨</span>
                                    <span className="nav-text">Kurti idėją</span>
                                </Link>
                            </li>
                            {user?.role === 'admin' && (
                                <li className={page === "unapproved_ideas" ? "active" : ""}>
                                    <Link to="unapproved_ideas" className="nav-link" onClick={handleLinkClick}>
                                        <span className="nav-icon">⚙️</span>
                                        <span className="nav-text">Nepatvirtintos</span>
                                    </Link>
                                </li>
                            )}
                            <li className={page === "contacts" ? "active" : ""}>
                                <Link to="contacts" className="nav-link" onClick={handleLinkClick}>
                                    <span className="nav-icon">📞</span>
                                    <span className="nav-text">Kontaktai</span>
                                </Link>
                            </li>
                        </ul>
                        
                        <div className="auth-section">
                            {user !== null && user.role === 'guest' && (
                                <div className="auth-buttons">
                                    <Link to="login" className={`auth-button login ${page === "login" ? "active" : ""}`} onClick={handleLinkClick}>
                                        Prisijungti
                                    </Link>
                                    <Link to="register" className={`auth-button register ${page === "register" ? "active" : ""}`} onClick={handleLinkClick}>
                                        Registruotis
                                    </Link>
                                </div>
                            )}
                            
                            {user !== null && user.role !== 'guest' && (
                                <div className="user-info">
                                    <div className="avatar">
                                        <span>{user.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="user-details">
                                        <span className="user-name">{user.name}</span>
                                        <Link to="logout" className="logout-link" onClick={handleLinkClick}>
                                            Atsijungti
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="hamburger" ref={hamburgerRef}>
                        <span className="line"></span>
                        <span className="line"></span>
                        <span className="line"></span>
                    </div>
                </div>
            </nav>
            
            <div className="menubar" ref={menubarRef}>
                <div className="menubar-content">
                    <ul className="menubar-links">
                        <li className={page === "" ? "active" : ""}>
                            <Link to="" className="menubar-link" onClick={handleLinkClick}>
                                <span className="nav-icon">🏠</span>
                                <span className="nav-text">Pradinis</span>
                            </Link>
                        </li>
                        <li className={page === "all_ideas" ? "active" : ""}>
                            <Link to="all_ideas" className="menubar-link" onClick={handleLinkClick}>
                                <span className="nav-icon">💡</span>
                                <span className="nav-text">Visos idėjos</span>
                            </Link>
                        </li>
                        <li className={page === "create_idea" ? "active" : ""}>
                            <Link to="create_idea" className="menubar-link" onClick={handleLinkClick}>
                                <span className="nav-icon">✨</span>
                                <span className="nav-text">Kurti idėją</span>
                            </Link>
                        </li>
                        {user?.role === 'admin' && (
                            <li className={page === "unapproved_ideas" ? "active" : ""}>
                                <Link to="unapproved_ideas" className="menubar-link" onClick={handleLinkClick}>
                                    <span className="nav-icon">⚙️</span>
                                    <span className="nav-text">Nepatvirtintos idėjos</span>
                                </Link>
                            </li>
                        )}
                        <li className={page === "contacts" ? "active" : ""}>
                            <Link to="contacts" className="menubar-link" onClick={handleLinkClick}>
                                <span className="nav-icon">📞</span>
                                <span className="nav-text">Kontaktai</span>
                            </Link>
                        </li>
                    </ul>
                    
                    <div className="menubar-auth">
                        {user !== null && user.role === 'guest' && (
                            <div className="auth-buttons-mobile">
                                <Link to="login" className={`auth-button login ${page === "login" ? "active" : ""}`} onClick={handleLinkClick}>
                                    Prisijungti
                                </Link>
                                <Link to="register" className={`auth-button register ${page === "register" ? "active" : ""}`} onClick={handleLinkClick}>
                                    Registruotis
                                </Link>
                            </div>
                        )}
                        
                        {user !== null && user.role !== 'guest' && (
                            <div className="user-info-mobile">
                                <div className="avatar-mobile">
                                    <span>{user.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <div className="user-details-mobile">
                                    <span className="user-name-mobile">{user.name}</span>
                                    <Link to="logout" className="logout-link-mobile" onClick={handleLinkClick}>
                                        Atsijungti
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}