import React from "react";

import './Footer.css';

const Footer = props =>{

    const currentYear = new Date().getFullYear();
    return (
        <footer className="main-footer center">
            <p>Copyright &copy; {currentYear} Acme Ltd.</p>
        </footer>
    )
}

export default Footer;