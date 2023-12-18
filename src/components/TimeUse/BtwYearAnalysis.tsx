import React, { useState, useEffect, useCallback } from 'react';
import "../../css/timeuse.scss";
import BtwYearMenu from '../BtwYearMenu';
import BubbleChart from '../Bubble/Bubble';
import LoadingOverlay from '../LoadingOverlay';
import VerticalStackedBarChart from '../VerticalChart/VerticalChart';
import DualValueSegment from '../DualValueSegment/DualValueSegment';
import { prepareVerticalChartData } from './BtwYearDataCalculations';
import { ActivityOption, ChartDataProps, MenuSelectedProps, weekOption } from "../Types";
import { WeekOptions, fetchAndFilterDataForBtwYearAnalysis } from "../../utils/Helpers";


export const BtwYearAnalysis: React.FC<MenuSelectedProps> = ({ menuSelectedOptions }) => {

    const [isbtwLoading, setIsBtwLoading] = useState(false);
    const [btwYearFilteredData, setBtwYearFilteredData] = useState<any[]>([]);
    const [btwYearSelections, setBtwYearSelections] = useState<{ week: weekOption, activity: ActivityOption }>({ week: WeekOptions[0], activity: { label: "All", inHome: "All", outHome: "All" } });
    const [processedVerticalChartData, setProcessedVerticalChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [inHomeAverage, setInHomeAverage] = useState<number | null>(null);
    const [outHomeAverage, setOutHomeAverage] = useState<number | null>(null);
    const [maxYear, setMaxYear] = useState('');
    const [inHomeChangePercent, setInHomeChangePercent] = useState<number | null>(null);
    const [outHomeChangePercent, setOutHomeChangePercent] = useState<number | null>(null);


    const handleBtwYearMenuChange = useCallback((selections: { week: weekOption, activity: ActivityOption }) => {
        if (selections.activity === btwYearSelections.activity && selections.week === btwYearSelections.week) {
            return;
        }
        setBtwYearSelections(selections);
    }, [btwYearSelections]);

    useEffect(() => {
        setIsBtwLoading(true);

        Promise.all([
            fetchAndFilterDataForBtwYearAnalysis(menuSelectedOptions, btwYearSelections.week)
        ]).then(([btwYearFilteredData]) => {
            setBtwYearFilteredData(btwYearFilteredData);

            const { chartData: verticalData, averages, maxYear, inHomeChangePercent, outHomeChangePercent } = prepareVerticalChartData(btwYearFilteredData, btwYearSelections.activity);
            setProcessedVerticalChartData(verticalData);

            setInHomeAverage(averages.inHomeAvg);
            setOutHomeAverage(averages.outHomeAvg);
            setMaxYear(maxYear);
            setInHomeChangePercent(inHomeChangePercent);
            setOutHomeChangePercent(outHomeChangePercent);

            setIsBtwLoading(false);
        });
    }, [menuSelectedOptions, btwYearSelections]);


    return (
        <>
            {isbtwLoading && <LoadingOverlay />}
            <div className='home'>

                <BtwYearMenu onSelectionChange={handleBtwYearMenuChange} />

                <div className="betweenYear">
                    <div className="box SegmentAverage">
                        {inHomeAverage !== null && outHomeAverage !== null && (
                            <BubbleChart
                                inHomeValue={inHomeAverage}
                                outHomeValue={outHomeAverage}
                                chartTitle='Average over the years (min)' />
                        )}
                    </div>

                    <div className="box ChartAverage"><VerticalStackedBarChart
                        chartData={processedVerticalChartData}
                        title="Average minute per day per person" />
                    </div>

                    <div className="box SegmentChanges">
                        {maxYear && inHomeChangePercent !== null && outHomeChangePercent !== null && (
                            <DualValueSegment
                                title={`Change from 2003 to ${maxYear}`}
                                inHomeValue={`${inHomeChangePercent.toFixed(1)}%`}
                                outOfHomeValue={`${outHomeChangePercent.toFixed(1)}%`}
                            />
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}