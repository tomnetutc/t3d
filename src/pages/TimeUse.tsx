import React, { useState, useCallback } from 'react';
import "../css/timeuse.scss";
import { Navbar } from "../components/Navbar";
import { WithinYearAnalysis } from "../components/TimeUse/WithinYearAnalysis";
import { BtwYearAnalysis } from '../components/TimeUse/BtwYearAnalysis';
import { Option } from "../components/Types";
import Footer from '../components/Footer';

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
                <Footer />
            </div>
        </>
    );
}
