import "../../App.css";
import './HeaderContent.scss';
import Logo from '../../images/HomePage/LogoSVG.svg';
import graphImage from '../../images/HomePage/Graph.png';

export function HeaderContent(): JSX.Element {
  return (
    <div className="mainContainer">
      <div className="leftColumn"></div> {/* Left section for future content or spacing */}
      <div className="centerColumn">
        <div className="HeaderContent">
          <div className="contentWrapper">
            <div className="logoContainer">
              <img src={Logo} alt="Logo" className="logo" />
            </div>
            <div className="textContainer">
              <span className="title">Time Use, Travel, and Telework Dashboard</span>
              <span className="subtitle"><i>-- by TOMNET and TBD University Transportation Centers</i></span>
            </div>
          </div>
          <div className="demoButtonContainer">
            <button className="demoButton">WATCH DEMO</button>
          </div>
        </div>
      </div>
      <div className="rightColumn">
        <div className="graphImageContainer">
          <img src={graphImage} alt="Dashboard" className="graphImage" />
        </div>
      </div>
    </div>
  );
}