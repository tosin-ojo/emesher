import { Email, Facebook, Instagram, LinkedIn, ShoppingCartOutlined, Twitter } from '@material-ui/icons'
import React from 'react'
import './Footer.css'

const Footer = () => {
    return (
        <footer className="footer">
            <section>
                <ShoppingCartOutlined style={{fontSize:"100px"}}/>
            </section>
            <section>
                &copy; 2021 All Rights Reserved Terms of Use and Privacy Policy
            </section>
            <section>
                <Facebook />
                <Twitter />
                <LinkedIn />
                <Instagram />
                <Email />
            </section>
        </footer>
    )
}

export default Footer
