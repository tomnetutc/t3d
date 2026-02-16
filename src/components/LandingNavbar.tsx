import { NavLink } from "react-router-dom";
import timeTravelIcon from '../images/time-clockk.svg';
import { Container, Nav, Navbar as NavbarBs } from "react-bootstrap";

export function LandingNavbar(): JSX.Element {
    return (
        <NavbarBs sticky="top" expand="lg" className="bg-white shadow-sm">
            <Container>
                <Nav className="w-100 px-3">
                    <NavLink to="/" className="navbar-brand d-flex align-items-center me-auto">
                        <img src={timeTravelIcon} alt="Time Use Icon" style={{ width: '34px' }} />
                        <h4 className="fw-bold mb-0 ml-2">Time Use, Travel, and Telework Dashboard</h4>
                    </NavLink>
                    <NavbarBs.Toggle aria-controls="responsive-navbar-nav" />
                    <NavbarBs.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            {<NavLink to="/" className="nav-link">
                                Home
                            </NavLink>}
                            <NavLink to="/about" className="nav-link">
                                About
                            </NavLink>
                            <span className="nav-link disabled" style={{ cursor: 'default' }}>|</span>
                            <NavLink to="/timeuse" className="nav-link">
                                Time Use
                            </NavLink>
                            <NavLink to="/travel" className="nav-link">
                                Travel
                            </NavLink>
                            <NavLink to="/telework" className="nav-link">
                                Telework
                            </NavLink>
                            <span className="nav-link disabled" style={{ cursor: 'default' }}>|</span>
                            <NavLink to="/sample-composition" className="nav-link">
                                Survey Sample
                            </NavLink>
                        </Nav>
                    </NavbarBs.Collapse>
                </Nav>
            </Container>
        </NavbarBs>
    );
}
