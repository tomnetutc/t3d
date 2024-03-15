import "../../App.css";
import './HeaderContent.scss';
import graphImage from '../../images/HomePage/Graph.png';
import Logo from '../../images/HomePage/LogoSVG.svg';

export function HeaderContent(): JSX.Element {
  return (
    <div className="HeaderContent">
      <div className="contentWrapper">
        <div className="logoContainer">
          <img src={Logo} alt="Logo" className="logo"/>
        </div>
        <div className="textContainer">
          <span className="title">Time Use, Travel, and Telework Dashboard</span>
          <span className="subtitle"><i>-- by TOMNET and TBD University Transportation Centers</i></span>
        </div>
      </div>
      <div className="demoButtonContainer">
        <button className="demoButton">
            WATCH DEMO
        </button>    
      </div>
      <div className="graphImageContainer">
        <img src={graphImage} alt="Dashboard" className="graphImage"/>
      </div>
    </div>
  );
}
