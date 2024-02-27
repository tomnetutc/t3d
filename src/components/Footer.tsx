import React, { useEffect } from 'react';
import "../App.css";
import { hideFlagCounter, tracking } from "../utils/Helpers";
import { FooterProps } from './Types';

export default function Footer({ flagCounterHref, flagCounterSrc, docRefID, page, expiry }: FooterProps): JSX.Element {
    useEffect(() => {
        hideFlagCounter();
        tracking(docRefID, page, expiry);
    }, []);

    return (
        <div style={{ padding: '10px 20px', textAlign: 'center' }}>
            <hr className="hr-spec" />
            <div className="d-flex justify-content-between">
                <span id="visit-count"></span>
                <span id="total-count"></span>
            </div>
            <span className="d-block mb-3 mt-3 fst-italic">
                For any inquiries or feedback, please contact Dr. Irfan Batur at
                <a href="mailto:ibatur@asu.edu" className="ms-1">ibatur@asu.edu</a>
            </span>
            <span
                style={{
                    fontSize: "15px",
                    padding: "30px",
                }}
            >
                &copy; 2024 TOMNET UTC
            </span>

            {/* Flag Counter */}
            <a href={flagCounterHref}>
                <img src={flagCounterSrc} alt="Flag Counter" id="flag-counter-img" />
            </a>

        </div>
    );
}
