import React, { useState, useCallback, useEffect } from 'react';
import "../css/timeuse.scss";
import { Navbar } from "../components/Navbar";
import { WithinYearAnalysis } from "../components/TimeUse/WithinYearAnalysis";
import { BtwYearAnalysis } from '../components/TimeUse/BtwYearAnalysis';
import { Option } from "../components/Types";
import Footer from '../components/Footer';
import { TravelDataProvider, useDocumentTitle } from '../utils/Helpers';
import LoadingOverlay from '../components/LoadingOverlay';
import { set } from 'lodash';

export function TimeUse(): JSX.Element {

    useDocumentTitle('Time Use');

    const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
    const [includeDecemberToggle, setIncludeDecember] = useState(true);
    const [isWithinYearLoading, setIsWithinYearLoading] = useState(true);
    const [isBtwYearLoading, setIsBtwYearLoading] = useState(true);
    const [analysisType, setAnalysisType] = useState<'withinYear' | 'betweenYears'>('withinYear');

    const analysisKey = analysisType + "-analysis";

    const hangleToggleChange = useCallback((includeDecember: boolean) => {
        if (includeDecember !== includeDecemberToggle) {
            setIncludeDecember(includeDecember);
        }
    }, [includeDecemberToggle]);

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

    useEffect(() => {
        setMenuSelectedOptions([]);
        setIncludeDecember(true);
    }, [analysisType]);

    return (
        <>
            <Navbar
                key={analysisKey}
                onMenuOptionChange={handleMenuOptionChange} toggleState={hangleToggleChange}
                analysisType={analysisType}
                onAnalysisTypeChange={setAnalysisType}
            />

            {((analysisType == 'withinYear' && isWithinYearLoading) || (analysisType == 'betweenYears' && isBtwYearLoading)) && <LoadingOverlay />}


            <div className="home" style={{ backgroundColor: '#f5f5f5', padding: '30px 20px 20px' }}>
                {analysisType === 'withinYear' ? (
                    <WithinYearAnalysis
                        key={analysisKey}
                        menuSelectedOptions={menuSelectedOptions} toggleState={includeDecemberToggle}
                        setIsWithinYearLoading={setIsWithinYearLoading}
                    />
                ) : (
                    <BtwYearAnalysis
                        key={analysisKey}
                        menuSelectedOptions={menuSelectedOptions} toggleState={includeDecemberToggle}
                        setIsBtwYearLoading={setIsBtwYearLoading}
                    />
                )}
                <Footer
                    //Unique for each page
                    flagCounterHref='https://www.flagcounter.me/details/ewn'
                    flagCounterSrc='https://www.flagcounter.me/ewn/'
                    docRefID="8KJIyEzI8atItLmnwiou_timeuse"
                    page="hasVistedTimeUsePage"
                    expiry='timeUseExpiry'
                    hideFlagAndTracking={false}
                />
            </div>
        </>
    );
}
