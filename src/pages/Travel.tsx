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
    const [isWithinYearLoading, setIsWithinYearLoading] = useState(true);
    const [isBtwYearLoading, setIsBtwYearLoading] = useState(false);
    const [analysisType, setAnalysisType] = useState<'withinYear' | 'betweenYears'>('withinYear');

    const analysisKey = analysisType + "-analysis";

    useEffect(() => {
        if (!isBtwYearLoading && !isWithinYearLoading) {
            Promise.all([
                DataProvider.getInstance().loadData()
            ]).catch(console.error);
        }
    }, [isBtwYearLoading, isWithinYearLoading]);

    const handleMenuOptionChange = useCallback((options: Option[]) => {
        if (JSON.stringify(options) !== JSON.stringify(menuSelectedOptions)) {
            setMenuSelectedOptions(options);
        }
    }, [menuSelectedOptions]);

    useEffect(() => {
        setMenuSelectedOptions([]);
    }, [analysisType]);


    return (
        <>
            <Navbar
                key={analysisKey}
                onMenuOptionChange={handleMenuOptionChange}
                analysisType={analysisType}
                onAnalysisTypeChange={setAnalysisType}
            />

            {(isWithinYearLoading || isBtwYearLoading) && <LoadingOverlay />}
            <div className="home" style={{ backgroundColor: '#f5f5f5', padding: '30px 20px 20px' }}>
                {analysisType === 'withinYear' ? (
                    <WithinYearAnalysis
                        key={analysisKey}
                        menuSelectedOptions={menuSelectedOptions}
                        setIsWithinYearLoading={setIsWithinYearLoading}
                    />
                ) : (
                    <BtwYearAnalysis
                        key={analysisKey}
                        menuSelectedOptions={menuSelectedOptions}
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