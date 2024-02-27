import React, { useState, useEffect, useCallback } from 'react';
import "../../css/timeuse.scss";
import BtwYearMenu from './BtwYearMenu';
import BubbleChart from '../Bubble/Bubble';
import VerticalStackedBarChart from '../VerticalChart/VerticalChart';
import DualValueSegment from '../DualValueSegment/DualValueSegment';
import { prepareVerticalChartData } from './BtwYearDataCalculations';
import { ActivityOption, ChartDataProps, Option, weekOption } from "../Types";
import { DataProvider, WeekOptions, fetchAndFilterDataForBtwYearAnalysis } from "../../utils/Helpers";


export const BtwYearAnalysis: React.FC<{ menuSelectedOptions: Option[], setIsBtwYearLoading: (isLoading: boolean) => void }> = ({ menuSelectedOptions, setIsBtwYearLoading }) => {

    const [btwYearFilteredData, setBtwYearFilteredData] = useState<any[]>([]);
    const [btwYearSelections, setBtwYearSelections] = useState<{ week: weekOption, activity: ActivityOption, startYear: string, endYear: string }>({ week: WeekOptions[0], activity: { label: "All", inHome: "All", outHome: "All" }, startYear: "", endYear: "" });
    const [processedVerticalChartData, setProcessedVerticalChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [inHomeAverage, setInHomeAverage] = useState<number | null>(null);
    const [outHomeAverage, setOutHomeAverage] = useState<number | null>(null);
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [inHomeChangePercent, setInHomeChangePercent] = useState<number | null>(null);
    const [outHomeChangePercent, setOutHomeChangePercent] = useState<number | null>(null);
    const [inHomeChangeValue, setInHomeChangeValue] = useState<number | null>(null);
    const [outHomeChangeValue, setOutHomeChangeValue] = useState<number | null>(null);


    const handleBtwYearMenuChange = useCallback((selections: { week: weekOption, activity: ActivityOption, startYear: string, endYear: string }) => {
        if (selections.activity === btwYearSelections.activity && selections.week === btwYearSelections.week && selections.startYear === btwYearSelections.startYear && selections.endYear === btwYearSelections.endYear) {
            return;
        }
        setBtwYearSelections(selections);
    }, [btwYearSelections]);

    useEffect(() => {

        if (btwYearSelections.startYear === '' || btwYearSelections.endYear === '') {
            return;
        }

        setIsBtwYearLoading(true);

        Promise.all([
            fetchAndFilterDataForBtwYearAnalysis(DataProvider.getInstance(), menuSelectedOptions, btwYearSelections.week) //filtering for activity type is done in prepareVerticalChartData function
        ]).then(([btwYearFilteredData]) => {
            setBtwYearFilteredData(btwYearFilteredData);

            const { chartData: verticalData, averages, minYear, maxYear, inHomeChangePercent, outHomeChangePercent, inHomeChangeValue, outHomeChangeValue } = prepareVerticalChartData(btwYearFilteredData, btwYearSelections.activity, btwYearSelections.startYear, btwYearSelections.endYear);
            setProcessedVerticalChartData(verticalData);

            setInHomeAverage(averages.inHomeAvg);
            setOutHomeAverage(averages.outHomeAvg);
            setMinYear(minYear);
            setMaxYear(maxYear);
            setInHomeChangePercent(inHomeChangePercent);
            setOutHomeChangePercent(outHomeChangePercent);
            setInHomeChangeValue(inHomeChangeValue);
            setOutHomeChangeValue(outHomeChangeValue);

        }).finally(() => {
            setIsBtwYearLoading(false);
        });
    }, [menuSelectedOptions, btwYearSelections]);


    return (
        <>
            <div className='home' style={{ padding: '20px 0' }}>

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
                        title="Average time spent per person per day (min)"
                        isStacked={true}
                        showLegend={true} />
                    </div>

                    <div className="box SegmentChanges">
                        {maxYear && minYear && inHomeChangePercent !== null && outHomeChangePercent !== null && (
                            <DualValueSegment
                                title={`Change from ${minYear} to ${maxYear}`}
                                inHomeValue={inHomeChangePercent}
                                outOfHomeValue={outHomeChangePercent}
                                inHomeChangeValue={inHomeChangeValue}
                                outOfHomeChangeValue={outHomeChangeValue}
                            />
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}