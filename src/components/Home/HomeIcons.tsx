import "../../App.css";
import './HomeIcons.scss';
import TimeUseLogo from '../../images/HomePage/TimeUseLogo.svg';
import Travelogo from '../../images/HomePage/Travel logo.svg';
import TeleworkLogo from '../../images/HomePage/Telework Logo.svg';
import { Link } from 'react-router-dom';


export function HomeIcons(): JSX.Element {

  return (
    <>
      <div className="HomeIconsDiv" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span className="spanText" style={{ fontSize: 18.5, paddingTop: '30px', paddingBottom: '50px' }}><b>Dive Into the American Time Use Survey Data to Uncover Trends and Patterns</b></span>
        </div>
      </div>

      <div style={{ display: "flex", gap: '5%', alignContent: 'center', marginBottom: '50px' }}>
        <div className="column">
          <div className="column">
            <Link to="/timeuse" style={{ textDecoration: 'none' }}>
              <img src={TimeUseLogo} alt="Logo" style={{ maxWidth: '200px', height: '200px', padding: 10 }} />
              <p className="Header">Time Use</p>
            </Link>
            <span className="spanDescText">Explore how and where people spend their time during the day.</span>
          </div>
        </div>
        <div className="column">
          <Link to="/travel" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={Travelogo} alt="Logo" style={{ maxWidth: '200px', height: '200px', padding: 10 }} />
            <p className="Header">Travel</p>
          </Link>
          <span className="spanDescText">Get insights into people’s travel patterns by mode and purpose.</span>
        </div>
        <div className="column">
          <Link to="/telework" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={TeleworkLogo} alt="Logo" style={{ maxWidth: '200px', height: '200px', padding: 10 }} />
            <p className="Header">Telework</p>
          </Link>
          <span className="spanDescText">Examine the latest and historical teleworking trends.</span>
        </div>
      </div>
    </>
  );
}
