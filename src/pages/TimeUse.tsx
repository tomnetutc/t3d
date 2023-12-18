import React, { useState, useCallback } from 'react';
import "../css/timeuse.scss";
import { Navbar } from "../components/Navbar";
import { WithinYearAnalysis } from "../components/TimeUse/WithinYearAnalysis";
import { BtwYearAnalysis } from '../components/TimeUse/BtwYearAnalysis';
import { Option } from "../components/Types";

export function TimeUse(): JSX.Element {

    const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);

    const handleMenuOptionChange = useCallback((options: Option[]) => {
        if (JSON.stringify(options) !== JSON.stringify(menuSelectedOptions)) {
            setMenuSelectedOptions(options);
        }
    }, [menuSelectedOptions]);

    return (
        <>
            <Navbar onMenuOptionChange={handleMenuOptionChange} />
            <div className="home" style={{ backgroundColor: '#f5f5f5', padding: '130px 20px 20px' }}>
                <WithinYearAnalysis menuSelectedOptions={menuSelectedOptions} />
                <BtwYearAnalysis menuSelectedOptions={menuSelectedOptions} />
            </div>

            {/* Flag Counter */}
            <a href="https://www.flagcounter.me/details/ei0">
                <img src="https://www.flagcounter.me/ei0/" alt="Flag Counter" id="flag-counter-img" />
            </a>
        </>
    );
}
