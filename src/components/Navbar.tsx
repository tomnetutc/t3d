import React from 'react';
import { NavLink } from "react-router-dom";
import { Navbar as NavbarBs, Nav } from "react-bootstrap";
import timeTravelIcon from '../images/time-clockk.svg';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import '../css/navbar.css';
import Menu from './Menu';
import { NavbarProps } from './Types';
import { Button } from 'react-bootstrap';

export const Navbar: React.FC<NavbarProps> = ({ onMenuOptionChange, analysisType, onAnalysisTypeChange }) => {
    const activeButtonStyle = {
        backgroundColor: '#C4F5B0',
        color: 'black',
        borderColor: 'black',
        marginRight: '10px'
    };

    const defaultButtonStyle = {
        backgroundColor: 'white',
        color: 'black',
        borderColor: 'black',
        marginRight: '10px'
    };

    return (
        <NavbarBs sticky="top" className="my-navbar shadow-sm">
            <Nav className="w-100 px-3">
                <NavLink to="/" className="navbar-brand d-flex align-items-center me-auto" style={{ padding: '2px 20px' }}>
                    <img src={timeTravelIcon} alt="Time Use Icon" style={{ width: '34px' }} />
                    <h4 className="fw-bold mb-0 ml-2">Time Use, Travel, and Telework Dashboard</h4>
                </NavLink>
                <div className="d-flex flex-row align-items-center" style={{ padding: '2px 20px' }}>
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
                </div>
            </Nav>
            <div className='hr-content'>
                <hr className='hr-spec' />
            </div>
            <div className="title-and-buttons" style={{ padding: '10px 40px' }}>
                <div className="analysis-buttons-container" >
                    <Button
                        size="sm"
                        onClick={() => onAnalysisTypeChange('withinYear')}
                        style={analysisType === "withinYear" ? activeButtonStyle : defaultButtonStyle}>
                        Within Year Analysis
                    </Button>
                    
                    <Button
                        size="sm"
                        onClick={() => onAnalysisTypeChange('betweenYears')}
                        style={analysisType === "betweenYears" ? activeButtonStyle : defaultButtonStyle}>
                        Between Year Analysis
                    </Button>
                </div>
            </div>
            <div className='hr-content'>
                <hr className='hr-spec' />
            </div>
            <Menu onOptionChange={onMenuOptionChange} />
        </NavbarBs>
    );
}

export default Navbar;