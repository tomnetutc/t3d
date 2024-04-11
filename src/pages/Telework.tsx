import React, { useState, useCallback, useEffect } from 'react';
import "../css/timeuse.scss";
import { Navbar } from "../components/Navbar";
import { Option } from "../components/Types";
import Footer from '../components/Footer';
import { TravelDataProvider, useDocumentTitle } from '../utils/Helpers';
import LoadingOverlay from '../components/LoadingOverlay';
import { WithinYearAnalysis } from '../components/Telework/WithinYearAnalysis';
import { BtwYearAnalysis } from '../components/Telework/BtwYearAnalysis';
import { set } from 'lodash';

export function Telework(): JSX.Element {
    useDocumentTitle('Telework');

    const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
    const [includeDecemberToggle, setIncludeDecember] = useState(true);
    const [isWithinYearLoading, setIsWithinYearLoading] = useState(true);
    const [isBtwYearLoading, setIsBtwYearLoading] = useState(true);
    const [analysisType, setAnalysisType] = useState<'withinYear' | 'betweenYears'>('withinYear');

    const analysisKey = analysisType + "-analysis";

    useEffect(() => {
        if (!isBtwYearLoading || !isWithinYearLoading) {
            Promise.all([
                TravelDataProvider.getInstance().loadData()
            ]).catch(console.error);
        }
    }, [isBtwYearLoading, isWithinYearLoading]);

    useEffect(() => {
        setIsWithinYearLoading(true);
        setIsBtwYearLoading(true);
    }, [analysisType]);

    const handleMenuOptionChange = useCallback((options: Option[]) => {
        if (JSON.stringify(options) !== JSON.stringify(menuSelectedOptions)) {
            setMenuSelectedOptions(options);
        }
    }, [menuSelectedOptions]);

    const hangleToggleChange = useCallback((includeDecember: boolean) => {
        if (includeDecember !== includeDecemberToggle) {
            setIncludeDecember(includeDecember);
        }
    }, [includeDecemberToggle]);

    useEffect(() => {
        setMenuSelectedOptions([]);
        setIncludeDecember(true);
    }, [analysisType]);

    return (
        <>
            <Navbar
                key={analysisKey} // Use the key here if Navbar needs to reset
                onMenuOptionChange={handleMenuOptionChange} toggleState={hangleToggleChange}
                analysisType={analysisType}
                onAnalysisTypeChange={setAnalysisType}
                isTeleworkPage={true}
            />

            {((analysisType == 'withinYear' && isWithinYearLoading) || (analysisType == 'betweenYears' && isBtwYearLoading)) && <LoadingOverlay />}
            <div className="home" style={{ backgroundColor: '#f5f5f5', padding: '30px 20px 20px' }}>
                {analysisType === 'withinYear' ? (
                    <WithinYearAnalysis
                        key={analysisKey} // Applying the key strategy here
                        menuSelectedOptions={menuSelectedOptions} toggleState={includeDecemberToggle}
                        setIsWithinYearLoading={setIsWithinYearLoading}
                    />
                ) : (
                    <BtwYearAnalysis
                        key={analysisKey} // And here
                        menuSelectedOptions={menuSelectedOptions} toggleState={includeDecemberToggle}
                        setIsBtwYearLoading={setIsBtwYearLoading}
                    />
                )}
                <Footer
                    flagCounterHref='https://www.flagcounter.me/details/ewp'
                    flagCounterSrc='https://www.flagcounter.me/ewp/'
                    docRefID="IdHegFzmqUaWsHomHVMe_telework"
                    page="hasVisitedTeleworkPage"
                    expiry='teleworkExpiry'
                    hideFlagAndTracking={false}
                />
            </div>
        </>
    );
}
