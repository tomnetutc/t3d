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
import { CrossSegmentAnalysis } from '../components/Telework/CrossSegmentAnalysis';

export function Telework(): JSX.Element {
    useDocumentTitle('Telework');

    const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
    const [crossSegmentSelectedOptions, setCrossSegmentSelectedOptions] = useState<Option[][]>([[]]);
    const [includeDecemberToggle, setIncludeDecember] = useState(true);
    const [isWithinYearLoading, setIsWithinYearLoading] = useState(true);
    const [isBtwYearLoading, setIsBtwYearLoading] = useState(true);
    const [isCrossSegmentLoading, setIsCrossSegmentLoading] = useState(false);
    const [analysisType, setAnalysisType] = useState<'withinYear' | 'betweenYears' | 'crossSegment'>('withinYear');

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
        setIsCrossSegmentLoading(true); // change to true when cross segment is implemented
        setMenuSelectedOptions([]);
        setCrossSegmentSelectedOptions([[]]);
        setIncludeDecember(true);
        window.scrollTo(0, 0);
    }, [analysisType]);

    //Removes the ith entry from the cross segment segment selections
    const handleProfileRemove = useCallback((IRemoveIndex: number) => {
        setCrossSegmentSelectedOptions(prevOptions => prevOptions.filter((_, index) => index !== IRemoveIndex));
    }, []);

    const handleMenuOptionChange = useCallback((options: Option[] | Option[][]) => {
        // Check if the first element is an array to determine if it's Option[][].
        const isOptionArrayArray = Array.isArray(options[0]);

        if (isOptionArrayArray) {
            if (JSON.stringify(options) !== JSON.stringify(crossSegmentSelectedOptions)) {
                setCrossSegmentSelectedOptions(options as Option[][]);
            }
        } else {
            if (JSON.stringify(options) !== JSON.stringify(menuSelectedOptions)) {
                setMenuSelectedOptions(options as Option[]);
            }
        }
    }, [menuSelectedOptions, crossSegmentSelectedOptions]);

    const hangleToggleChange = useCallback((includeDecember: boolean) => {
        if (includeDecember !== includeDecemberToggle) {
            setIncludeDecember(includeDecember);
        }
    }, [includeDecemberToggle]);

    return (
        <>
            <Navbar
                key={analysisKey} // Use the key here if Navbar needs to reset
                onMenuOptionChange={handleMenuOptionChange} toggleState={hangleToggleChange}
                analysisType={analysisType}
                onAnalysisTypeChange={setAnalysisType}
                isTeleworkPage={true}
                updatedCrossSegmentSelections={crossSegmentSelectedOptions}
            />

            {((analysisType == 'withinYear' && isWithinYearLoading) || (analysisType == 'betweenYears' && isBtwYearLoading) || (analysisType == 'crossSegment' && isCrossSegmentLoading)) && <LoadingOverlay />}
            <div className="home" style={{ backgroundColor: '#f5f5f5', padding: '30px 20px 20px' }}>
                {analysisType === 'withinYear' ? (
                    <WithinYearAnalysis
                        key={analysisKey} // Applying the key strategy here
                        menuSelectedOptions={menuSelectedOptions} toggleState={includeDecemberToggle}
                        setIsWithinYearLoading={setIsWithinYearLoading}
                    />
                ) : analysisType === 'betweenYears' ? (
                    <BtwYearAnalysis
                        key={analysisKey} // And here
                        menuSelectedOptions={menuSelectedOptions} toggleState={includeDecemberToggle}
                        setIsBtwYearLoading={setIsBtwYearLoading}
                    />
                ) : (
                    <CrossSegmentAnalysis
                        key={analysisKey}
                        menuSelectedOptions={crossSegmentSelectedOptions}
                        toggleState={includeDecemberToggle}
                        setIsCrossSegmentLoading={setIsCrossSegmentLoading}
                        onProfileRemove={handleProfileRemove}
                    />
                )}
                <Footer
                    docRefID="IdHegFzmqUaWsHomHVMe_telework"
                    page="hasVisitedTeleworkPage"
                    expiry='teleworkExpiry'
                />
            </div>
        </>
    );
}
