import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

import Auth from '../utils/auth';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);


  return (
    <>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          {Auth.loggedIn() ? (
            <Navbar.Brand as={Link} to='/Profile'>
              Yu-Gi-Oh Deck Builder
            </Navbar.Brand>
          ) : (
            <Navbar.Brand as={Link} to='/'>
              Yu-Gi-Oh Deck Builder
            </Navbar.Brand>
          )}
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar' className='flex-row-reverse'>
            <Nav className='ml-auto'>
              <Nav.Link as={Link} to='/Search'>
                Search For Cards
              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/Profile'>
                    My Profile
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to='/'>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;