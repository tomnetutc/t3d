import "../../App.css";
import './HomeFeatures.scss';
import FeaturesLogo from '../../images/HomePage/Features Logo.svg';
import FocusedAnalysisLogo from '../../images/HomePage/Focused Analysis Logo.svg';
import UserDrivenCustomizationLogo from '../../images/HomePage/User-Driven Customization Logo.svg';
import InstantInsightsLogo from '../../images/HomePage/Instant Insights Logo.svg';
import HowItWorksLogo from '../../images/HomePage/How It Works Logo.svg';
import { useNavigate } from 'react-router-dom';

export function HomeFeatures(): JSX.Element {
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
        window.scrollTo(0, 0);
    };


    return (
        <>
            <div className="HomeFeaturesDiv">
                <div className="FeaturesTitleHolder"style={{ paddingTop:'20px'}}>
                    <img src={FeaturesLogo} alt="Logo" style={{ maxWidth: '50px', height: '50px' }} />
                    <span className="SpanHeader" style={{ fontSize: '23.5px' }}><b>Key Features</b></span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="FeatureHolder">
                    <div className="FeatureText">
                        <span className="SpanHeader" style={{ paddingBottom: '15px' }}>Focused Analysis Areas</span>
                        <span className="SpanContent">With dedicated pages for Time Use, Travel Behavior, and Teleworking Analysis, T3D offers specialized insights into each area. Users can easily navigate between these dashboard pages to explore specific aspects of American life, enhancing the depth and breadth of their research.</span>
                    </div>
                    <div className="FeatureLogo">
                        <img src={FocusedAnalysisLogo} alt="FocusedAnalysisLogo" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                </div>
                <div className="FeatureHolder" style={{ backgroundColor: "white" }}>
                    <div className="FeatureText">
                        <span className="SpanHeader" style={{ paddingBottom: '15px' }}>User-Driven Customization</span>
                        <span className="SpanContent">Select from a range of sociodemographic attributes to tailor analyses. Our dashboard enables users to conduct both within and between-year analyses for a comprehensive view of evolving trends for a selected population segment.</span>
                    </div>
                    <div className="FeatureLogo">
                        <img src={UserDrivenCustomizationLogo} alt="UserDrivenCustomizationLogo" style={{ maxWidth: '100%', height: '140px' }} />
                    </div>
                </div>
                <div className="FeatureHolder">
                    <div className="FeatureText">
                        <span className="SpanHeader" style={{ paddingBottom: '15px' }}>Instant Insights</span>
                        <span className="SpanContent">T3D updates dynamically, providing immediate visualizations that reflect the impact of user-selected segments. This feature encourages active exploration of the data, allowing for a deeper engagement and understanding of societal trends.</span>
                    </div>
                    <div className="FeatureLogo">
                        <img src={InstantInsightsLogo} alt="InstantInsightsLogo" style={{ maxWidth: '100%', width:'140px', height:'140px' }} />
                    </div>
                </div>
                <div className="FeatureHolder" style={{ backgroundColor: "white", height:'auto', paddingBottom:'30px'}}>
                    <div className="FeatureText">
                        <span className="SpanHeader" style={{ paddingBottom: '15px', paddingTop: '30px' }}>How It Works</span>
                        <span className="SpanContent">
                            <ol style={{ paddingLeft: '20px', color: "#657383", listStylePosition: 'outside' }}>
                                <li className="mt-2">
                                    <strong>Select Your Focus:</strong> Begin by choosing from the Time Use, Travel, or Telework pages on the T3D platform to focus your analysis.
                                </li>
                                <li className="mt-2">
                                    <strong>Customize the Data:</strong> Use the dashboard's filters to select demographic attributes and define your analysis segments.
                                </li>
                                <li className="mt-2">
                                    <strong>Explore the Insights:</strong> View instant updates on the dashboard as you refine your criteria.
                                </li>
                                <li className="mt-2">
                                    <strong>Deepen Your Analysis:</strong> Utilize the within and between-year comparison features to understand how behaviors and trends change within a single year or evolve over multiple years, offering a complete picture of the dynamics at play.
                                </li>
                            </ol>

                        </span>
                    </div>
                    <div className="FeatureLogo">
                        <img src={HowItWorksLogo} alt="Dashboard" style={{ maxWidth: '100%', width:'140px', height:'140px'}} />
                    </div>
                </div>

                <div className="FeatureHolder" style={{ flexDirection: 'column', paddingTop: '60px', paddingBottom: '60px', marginBottom: '100px', height:'auto'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span className="SpanContent" style={{ fontSize: '22px', fontWeight: 'bold', color: '#2E2E2E' }}>Begin Your Journey into Time, Travel, and Telework Analysis Now – Explore T3D to Uncover Hidden Patterns and Inform Future Decisions.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '30px' }}>
                        <button
                            className="dashboardButton"
                            style={{ backgroundColor: '#5EBCE5' }}
                            onClick={() => handleNavigate('/timeuse')}
                        >
                            TIME USE
                        </button>
                        <button
                            className="dashboardButton"
                            style={{ backgroundColor: '#B678E6' }}
                            onClick={() => handleNavigate('/travel')}
                        >
                            TRAVEL
                        </button>
                        <button
                            className="dashboardButton"
                            style={{ backgroundColor: '#E25B61' }}
                            onClick={() => handleNavigate('/telework')}
                        >
                            TELEWORK
                        </button>
                    </div>
                </div>
            </div>
        </>)
}