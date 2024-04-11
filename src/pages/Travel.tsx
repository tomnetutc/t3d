import React, { useState, useCallback, useEffect } from 'react';
import "../css/timeuse.scss";
import { Navbar } from "../components/Navbar";
import { Option } from "../components/Types";
import Footer from '../components/Footer';
import { WithinYearAnalysis } from '../components/Travel/WithinYearAnalysis';
import { BtwYearAnalysis } from '../components/Travel/BtwYearAnalysis';
import { DataProvider, useDocumentTitle } from '../utils/Helpers';
import LoadingOverlay from '../components/LoadingOverlay';

export function Travel(): JSX.Element {

    useDocumentTitle('Travel');

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
                DataProvider.getInstance().loadData()
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
                    flagCounterHref='https://www.flagcounter.me/details/ewo'
                    flagCounterSrc='https://www.flagcounter.me/ewo/'
                    docRefID="YUVbvahGYJyzJNon5CGl_travel"
                    page="hasVistedTravelPage"
                    expiry='travelExpiry'
                    hideFlagAndTracking={false}
                />
            </div>
        </>
    );
}