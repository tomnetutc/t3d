import React, { useEffect } from 'react';
import "../App.css";
import { hideFlagCounter, tracking } from "../utils/Helpers";
import { FooterProps } from './Types';
import asuLogo from '../images/Logo/asu.png';
import tbdLogo from '../images/Logo/tbd.png';
import utAustinLogo from '../images/Logo/utaustin.png';
import usDotLogo from '../images/Logo/us-dot.png';
import tomnetLogo from '../images/Logo/tomnet.png';

export default function Footer({ flagCounterHref, flagCounterSrc, docRefID, page, expiry, footerBackgroundcolor = '' }: FooterProps): JSX.Element {
    useEffect(() => {

        if (docRefID=="") {
            hideFlagCounter();
        }
        else {
            hideFlagCounter();
            tracking(docRefID, page, expiry);
        }
    }, []);

    return (
        <div style={{ zIndex: 1000, position: 'relative', backgroundColor: footerBackgroundcolor }}>
            <div style={{ padding: '0 0px', textAlign: 'center' }}>
                <hr className="hr-spec" />
                <div style={{ padding: '3px 5px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{
                            width: '60%',
                            paddingRight: '10px',
                            position: 'relative'
                        }}>
                            <span className="d-block mb-3 mt-3" style={{ fontWeight: "700" }}>
                                Have any questions or feedback?
                            </span>
                            <span className="d-block mb-3">
                                For any inquiries or feedback, please contact Dr. Irfan Batur at
                                <a href="mailto:ibatur@asu.edu" className="ms-1">ibatur@asu.edu</a>
                            </span>
                            <div style={{
                                position: 'absolute',
                                top: '50%', // Starts at the middle
                                right: 0,
                                transform: 'translateY(-50%)', // Shifts it up by half its height to center
                                height: '40px', // Smaller height as per your request
                                width: '2px',
                                backgroundColor: '#352c26',
                                opacity: 0.2
                            }}></div>
                        </div>

                        <div style={{
                            width: '39%',
                            paddingLeft: '20px'
                        }}>
                            <span className="d-block mb-3 mt-3" style={{ fontWeight: "700" }}>
                                Visitor Statistics
                            </span>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '20px',
                                height: '20px',
                            }}>
                                <span id="visit-count">Visit Count</span>

                                <div style={{
                                    width: '1px',
                                    height: '100%',
                                    backgroundColor: '#352c26',
                                    opacity: 0.2,
                                }}></div>

                                <span id="total-count">Total Count</span>
                            </div>
                        </div>
                    </div>
                </div>


                <hr className="hr-spec"></hr>

                <div className='d-block mt-2'>
                    <div style={{ paddingTop: '20px' }}>
                        <span style={{ marginRight: "15px", fontWeight: "700", paddingTop: '10px' }}>Our Sponsors</span>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', flexWrap: 'wrap' }}>
                    <a href='https://www.transportation.gov/' target='_blank' rel='noreferrer'>
                        <img src={usDotLogo} alt="USDOT Logo" style={{ width: "220px", margin: "10px" }} />
                    </a>
                    <a href="https://www.utexas.edu/" target='_blank' rel="noreferrer">
                        <img src={utAustinLogo} alt="UT Austin Logo" style={{ width: "170px", margin: "10px" }} />
                    </a>
                    <a href="https://tbd.ctr.utexas.edu/" target='_blank' rel="noreferrer">
                        <img src={tbdLogo} alt="UT CTR Logo" style={{ width: "210px", margin: "10px" }} />
                    </a>
                    <a href='https://tomnet-utc.engineering.asu.edu/' target='_blank' rel='noreferrer'>
                        <img src={tomnetLogo} alt="TOMNET Logo" style={{ width: "280px", margin: "10px" }} />
                    </a>
                    <a href="https://www.asu.edu/" target="_blank" rel="noreferrer">
                        <img src={asuLogo} alt="ASU Logo" style={{ width: "200px", margin: "10px" }} />
                    </a>
                </div>

                <hr className="hr-spec"></hr>

                <span
                    style={{
                        fontSize: "15px",
                        padding: "30px",
                        display: "block",
                        width: "100%",
                    }}
                >
                    &copy; 2024 TOMNET UTC
                </span>
            </div>
        </div>
    );
}
