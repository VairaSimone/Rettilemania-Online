import React from 'react';
import '../Style/Footer.css'; 
const Footer = () => {

    return (
        <footer className="footer bg-dark text-white mt-5 p-4 text-center">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <h5 className="footer-title">Informazioni</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="footer-link">Chi siamo</a></li>
                            <li><a href="#" className="footer-link">Contatti</a></li>
                            <li><a href="#" className="footer-link">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5 className="footer-title">Servizi</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="footer-link">Gestione rettili</a></li>
                            <li><a href="#" className="footer-link">Consulenza</a></li>
                            <li><a href="#" className="footer-link">Supporto tecnico</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5 className="footer-title">Seguici</h5>
                        <a href="#" className="footer-social-link me-2"><i className="fab fa-facebook"></i></a>
                        <a href="#" className="footer-social-link me-2"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="footer-social-link"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <p className="footer-copyright mb-0">© 2024 Rettilemania. Tutti i diritti riservati.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
