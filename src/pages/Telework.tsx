import React, { useState, useCallback, useEffect } from 'react';
import "../css/timeuse.scss";
import { Navbar } from "../components/Navbar";
import { Option } from "../components/Types";
import Footer from '../components/Footer';
import { TravelDataProvider, useDocumentTitle } from '../utils/Helpers';
import LoadingOverlay from '../components/LoadingOverlay';
import { WithinYearAnalysis } from '../components/Telework/WithinYearAnalysis';
import { BtwYearAnalysis } from '../components/Telework/BtwYearAnalysis';

export function Telework(): JSX.Element {

    useDocumentTitle('Telework');

    const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
    const [isWithinYearLoading, setIsWithinYearLoading] = useState(true);
    const [isBtwYearLoading, setIsBtwYearLoading] = useState(false);

    useEffect(() => {
        if (!isBtwYearLoading && !isWithinYearLoading) {
            Promise.all([
                TravelDataProvider.getInstance().loadData()
            ]).catch(console.error);
        }
    }, [isBtwYearLoading, isWithinYearLoading]);

    const handleMenuOptionChange = useCallback((options: Option[]) => {
        if (JSON.stringify(options) !== JSON.stringify(menuSelectedOptions)) {
            setMenuSelectedOptions(options);
        }
    }, [menuSelectedOptions]);

    return (
        <>
            <Navbar onMenuOptionChange={handleMenuOptionChange} />
            {(isWithinYearLoading || isBtwYearLoading) && <LoadingOverlay />}
            <div className="home" style={{ backgroundColor: '#f5f5f5', padding: '30px 20px 20px' }}>
                <WithinYearAnalysis menuSelectedOptions={menuSelectedOptions} setIsWithinYearLoading={setIsWithinYearLoading} />
                <BtwYearAnalysis menuSelectedOptions={menuSelectedOptions} setIsBtwYearLoading={setIsBtwYearLoading} />
                <Footer
                    //Unique for each page
                    flagCounterHref='https://www.flagcounter.me/details/ewp'
                    flagCounterSrc='https://www.flagcounter.me/ewp/'
                    docRefID="IdHegFzmqUaWsHomHVMe_telework"
                    page="hasVistedTeleworkPage"
                    expiry='teleworkExpiry'
                    hideFlagAndTracking={false}
                />
            </div>
        </>
    );
}
