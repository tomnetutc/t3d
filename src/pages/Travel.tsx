import React, { useState, useCallback } from 'react';
import "../css/timeuse.scss";
import { Navbar } from "../components/Navbar";
import { Option } from "../components/Types";
import Footer from '../components/Footer';
import { WithinYearAnalysis } from '../components/Travel/WithinYearAnalysis';
import { BtwYearAnalysis } from '../components/Travel/BtwYearAnalysis';
import { useDocumentTitle } from '../utils/Helpers';
import LoadingOverlay from '../components/LoadingOverlay';

export function Travel(): JSX.Element {

    useDocumentTitle('Travel');

    const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
    const [isWithinYearLoading, setIsWithinYearLoading] = useState(true);
    const [isBtwYearLoading, setIsBtwYearLoading] = useState(true);

    const handleMenuOptionChange = useCallback((options: Option[]) => {
        if (JSON.stringify(options) !== JSON.stringify(menuSelectedOptions)) {
            setMenuSelectedOptions(options);
        }
    }, [menuSelectedOptions]);

    return (
        <>
            <Navbar onMenuOptionChange={handleMenuOptionChange} />
            {(isWithinYearLoading || isBtwYearLoading) && <LoadingOverlay />}
            <div className="home" style={{ backgroundColor: '#f5f5f5', padding: '130px 20px 20px' }}>
                <WithinYearAnalysis menuSelectedOptions={menuSelectedOptions} setIsWithinYearLoading={setIsWithinYearLoading} />
                <BtwYearAnalysis menuSelectedOptions={menuSelectedOptions} setIsBtwYearLoading={setIsBtwYearLoading} />
                <Footer />
            </div>
        </>
    );
}