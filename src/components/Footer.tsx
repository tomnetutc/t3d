import React, { useEffect } from 'react';
import "../App.css";
import { hideFlagCounter, tracking } from "../utils/Helpers";

export default function Footer(): JSX.Element {
    useEffect(() => {
        hideFlagCounter();
        tracking();
    });

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
            <a href="https://www.flagcounter.me/details/ei0">
                <img src="https://www.flagcounter.me/ei0/" alt="Flag Counter" id="flag-counter-img" />
            </a>

        </div>
    );
}
