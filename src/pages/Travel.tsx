import React, { useState, useCallback, useEffect } from 'react';
import "../css/timeuse.scss";
import { Navbar } from "../components/Navbar";
import { Option } from "../components/Types";
import Footer from '../components/Footer';
import { WithinYearAnalysis } from '../components/Travel/WithinYearAnalysis';
import { BtwYearAnalysis } from '../components/Travel/BtwYearAnalysis';
import { DataProvider, useDocumentTitle } from '../utils/Helpers';
import LoadingOverlay from '../components/LoadingOverlay';
import { CrossSegmentAnalysis } from '../components/Travel/CrossSegmentAnalysis';

export function Travel(): JSX.Element {

    useDocumentTitle('Travel');

    const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
    const [crossSegmentSelectedOptions, setCrossSegmentSelectedOptions] = useState<Option[][]>([[]]);
    const [includeDecemberToggle, setIncludeDecember] = useState(true);
    const [isWithinYearLoading, setIsWithinYearLoading] = useState(true);
    const [isBtwYearLoading, setIsBtwYearLoading] = useState(true);
    const [isCrossSegmentLoading, setIsCrossSegmentLoading] = useState(true);
    const [analysisType, setAnalysisType] = useState<'withinYear' | 'betweenYears' | 'crossSegment'>('withinYear');

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
        setIsCrossSegmentLoading(true);
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

    return (
        <>
            <Navbar
                key={analysisKey}
                onMenuOptionChange={handleMenuOptionChange} toggleState={hangleToggleChange}
                analysisType={analysisType}
                onAnalysisTypeChange={setAnalysisType}
                updatedCrossSegmentSelections={crossSegmentSelectedOptions}
            />

            {((analysisType == 'withinYear' && isWithinYearLoading) || (analysisType == 'betweenYears' && isBtwYearLoading) || (analysisType == 'crossSegment' && isCrossSegmentLoading)) && <LoadingOverlay />}
            <div className="home" style={{ backgroundColor: '#f5f5f5', padding: '30px 20px 20px' }}>
                {analysisType === 'withinYear' ? (
                    <WithinYearAnalysis
                        key={analysisKey}
                        menuSelectedOptions={menuSelectedOptions} toggleState={includeDecemberToggle}
                        setIsWithinYearLoading={setIsWithinYearLoading}
                    />
                ) : analysisType === 'betweenYears' ? (
                    <BtwYearAnalysis
                        key={analysisKey}
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
                    //Unique for each page
                    docRefID="YUVbvahGYJyzJNon5CGl_travel"
                    page="hasVistedTravelPage"
                    expiry='travelExpiry'
                />
            </div>
        </>
    );
}