import React, { useEffect } from 'react';
import "../App.css";
import { hideFlagCounter, tracking } from "../utils/Helpers";
import { FooterProps } from './Types';
import asuLogo from '../images/Logo/asu.png';
import tbdLogo from '../images/Logo/tbd.png';
import utAustinLogo from '../images/Logo/utaustin.png';
import usDotLogo from '../images/Logo/us-dot.png';
import tomnetLogo from '../images/Logo/tomnet.png';

export default function Footer({ flagCounterHref, flagCounterSrc, docRefID, page, expiry, hideFlagAndTracking}: FooterProps): JSX.Element {
    useEffect(() => {

        if(hideFlagAndTracking){
            hideFlagCounter();
        }
        else{
            hideFlagCounter();
            tracking(docRefID, page, expiry);    
        }
    }, []);

    return (
        <div style={{ zIndex: 1000, position:'relative', backgroundColor:'white'}}>
        <div style={{ padding: '0 20px', textAlign: 'center'}}>
            <hr className="hr-spec" />
            <div className="d-flex justify-content-between">
                <span id="visit-count"></span>
                <span id="total-count"></span>
            </div>

            <span className="d-block mb-3 mt-3 fst-italic">
                For any inquiries or feedback, please contact Dr. Irfan Batur at
                <a href="mailto:ibatur@asu.edu" className="ms-1">ibatur@asu.edu</a>
            </span>

            <div className='d-block mt-2'>
                <span style={{ marginRight: "15px" }}>Sponsored by</span>
                <a href='https://www.transportation.gov/' target='_blank' rel='noreferrer'>
                    <img src={usDotLogo} alt="USDOT Logo" style={{ width: "110px", marginRight: "15px" }} />
                </a>
            </div>
            <span className='d-block mt-2'>
                <a href="https://www.utexas.edu/" target='_blank' rel="noreferrer">
                    <img src={utAustinLogo} alt="UT Austin Logo" style={{ width: "170px", marginRight: "15px" }} />
                </a>

                <a href="https://tbd.ctr.utexas.edu/" target='_blank' rel="noreferrer">
                    <img src={tbdLogo} alt="UT CTR Logo" style={{ width: "210px", marginRight: "15px" }} />
                </a>

                <a href='https://tomnet-utc.engineering.asu.edu/' target='_blank' rel='noreferrer'>
                    <img src={tomnetLogo} alt="TOMNET Logo" style={{ width: "280px", marginRight: "15px" }} />
                </a>
                <a href="https://www.asu.edu/" target="_blank" rel="noreferrer">
                    <img src={asuLogo} alt="ASU Logo" style={{ width: "200px" }} />
                </a>

            </span>

            <span
                style={{
                    fontSize: "15px",
                    padding: "30px",
                    display: "block",
                    width: "100vw", 
                }}
            >
                &copy; 2024 TOMNET UTC
            </span>
            {!hideFlagAndTracking && (
                <a href={flagCounterHref}>
                    <img src={flagCounterSrc} alt="Flag Counter" id="flag-counter-img" />
                </a>
            )}
        </div>
        </div>
    );
}
