import React from 'react';
import { NavLink } from "react-router-dom";
import { Navbar as NavbarBs, Nav } from "react-bootstrap";
import timeTravelIcon from '../images/time-clockk.svg';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import '../css/navbar.css';
import Menu from './Menu';
import { NavbarProps } from './Types';

export const Navbar: React.FC<NavbarProps> = ({ onMenuOptionChange }) => {
    return (
        <NavbarBs bg="white" className="my-navbar shadow-sm fixed-top">
            <Nav className="w-100 px-3">
                <NavLink to="/" className="navbar-brand d-flex align-items-center me-auto" style={{ padding: '2px 20px' }}>
                    <img src={timeTravelIcon} alt="Time Use Icon" style={{ width: '34px' }} />
                    <h4 className="fw-bold mb-0 ml-2">Time Use, Travel, and Telework Dashboard</h4>
                </NavLink>
                <div className="d-flex flex-row align-items-center" style={{ padding: '2px 20px' }}>
                    <NavLink to="/" className="nav-link">
                        Time Use
                    </NavLink>
                    {/* Additional NavLinks go here */}
                </div>
            </Nav>
            <div className='hr-content'>
                <hr className='hr-spec' />
            </div>
            <Menu onOptionChange={onMenuOptionChange} />
        </NavbarBs>
    );
}

export default Navbar;