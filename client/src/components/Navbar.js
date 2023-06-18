import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab, Image } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { ThemeContext } from '../utils/themeContext';
import Auth from '../utils/auth';
import { motion } from 'framer-motion';
import LoginSignupIndex from './login-signup/Login-Signup-index';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentImage } = useContext(ThemeContext);
  const [isTop, setIsTop] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navBarClasses = `bg-${isTop && isHomePage ? currentImage.color : 'white'} nav-bar`;
  const logoSrc = isTop ? '/images/logo-white.avif' : '/images/logo-black.avif';
  const navLinkColor = isTop ? 'text-white' : 'text-black';
  const buttonColor = isTop ? 'p-button-outlined' : '';

  return (
    <>
      <Navbar className={navBarClasses} expand='lg' sticky='top'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/'>
            <Image src={logoSrc} className='nav-img'></Image>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='bg-white'/>
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className='ml-auto d-flex'>
              <Nav.Link as={Link} to='/' className={navLinkColor}>
                Explore
              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link onClick={Auth.logout} className={navLinkColor}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link onClick={() => setShowModal(true)} className={navLinkColor}>Sign in</Nav.Link>
                  <Nav.Link onClick={() => setShowModal(true)}>
                    <Button label="Join" severity="success" size='small' className={buttonColor} />
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
     
        <Modal
          as={motion.div}
          size='xl'
          show={showModal}
          onHide={() => setShowModal(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          dialogClassName="custom-modal" 
          
          
        >

         <LoginSignupIndex />

          
      
        </Modal>
        
    </>
  );
};

export default AppNavbar;
