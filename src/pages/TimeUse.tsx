import React, { useState, useCallback, useEffect } from 'react';
import "../css/timeuse.scss";
import { Navbar } from "../components/Navbar";
import { WithinYearAnalysis } from "../components/TimeUse/WithinYearAnalysis";
import { BtwYearAnalysis } from '../components/TimeUse/BtwYearAnalysis';
import { Option } from "../components/Types";
import Footer from '../components/Footer';
import { TravelDataProvider, useDocumentTitle } from '../utils/Helpers';
import LoadingOverlay from '../components/LoadingOverlay';

export function TimeUse(): JSX.Element {

    useDocumentTitle('Time Use');

    const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
    const [isWithinYearLoading, setIsWithinYearLoading] = useState(true);
    const [isBtwYearLoading, setIsBtwYearLoading] = useState(true);

    const handleMenuOptionChange = useCallback((options: Option[]) => {
        if (JSON.stringify(options) !== JSON.stringify(menuSelectedOptions)) {
            setMenuSelectedOptions(options);
        }
    }, [menuSelectedOptions]);

    useEffect(() => {
        if (!isBtwYearLoading && !isWithinYearLoading) {
            Promise.all([
                TravelDataProvider.getInstance().loadData()
            ]).catch(console.error);
        }
    }, [isBtwYearLoading, isWithinYearLoading]);

    return (
        <>
            <Navbar onMenuOptionChange={handleMenuOptionChange} />
            {(isWithinYearLoading || isBtwYearLoading) && <LoadingOverlay />}
            <div className="home" style={{ backgroundColor: '#f5f5f5', padding: '30px 20px 20px' }}>
                <WithinYearAnalysis menuSelectedOptions={menuSelectedOptions} setIsWithinYearLoading={setIsWithinYearLoading} />
                <BtwYearAnalysis menuSelectedOptions={menuSelectedOptions} setIsBtwYearLoading={setIsBtwYearLoading} />
                <Footer
                    //Unique for each page
                    flagCounterHref='https://www.flagcounter.me/details/ewn'
                    flagCounterSrc='https://www.flagcounter.me/ewn/'
                    docRefID="8KJIyEzI8atItLmnwiou_timeuse"
                    page="hasVistedTimeUsePage"
                    expiry='timeUseExpiry'
                />
            </div>
        </>
    );
}
