import React, { useState, useEffect, useCallback } from 'react';
import "../../css/timeuse.scss";
import BtwYearMenu from '../BtwYearMenu';
import BubbleChart from '../Bubble/Bubble';
import VerticalStackedBarChart from '../VerticalChart/VerticalChart';
import DualValueSegment from '../DualValueSegment/DualValueSegment';
import { prepareVerticalChartData } from './BtwYearDataCalculations';
import { ActivityOption, ChartDataProps, MenuSelectedProps, weekOption } from "../Types";
import { WeekOptions, fetchAndFilterDataForBtwYearAnalysis } from "../../utils/Helpers";


export const BtwYearAnalysis: React.FC<MenuSelectedProps> = ({ menuSelectedOptions }) => {

    const [btwYearFilteredData, setBtwYearFilteredData] = useState<any[]>([]);
    const [btwYearSelections, setBtwYearSelections] = useState<{ week: weekOption, activity: ActivityOption }>({ week: WeekOptions[0], activity: { label: "All", inHome: "All", outHome: "All" } });
    const [processedVerticalChartData, setProcessedVerticalChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [inHomeAverage, setInHomeAverage] = useState<number | null>(null);
    const [outHomeAverage, setOutHomeAverage] = useState<number | null>(null);
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [inHomeChangePercent, setInHomeChangePercent] = useState<number | null>(null);
    const [outHomeChangePercent, setOutHomeChangePercent] = useState<number | null>(null);
    const [inHomeChangeValue, setInHomeChangeValue] = useState<number | null>(null);
    const [outHomeChangeValue, setOutHomeChangeValue] = useState<number | null>(null);


    const handleBtwYearMenuChange = useCallback((selections: { week: weekOption, activity: ActivityOption }) => {
        if (selections.activity === btwYearSelections.activity && selections.week === btwYearSelections.week) {
            return;
        }
        setBtwYearSelections(selections);
    }, [btwYearSelections]);

    useEffect(() => {

        Promise.all([
            fetchAndFilterDataForBtwYearAnalysis(menuSelectedOptions, btwYearSelections.week)
        ]).then(([btwYearFilteredData]) => {
            setBtwYearFilteredData(btwYearFilteredData);

            const { chartData: verticalData, averages, minYear, maxYear, inHomeChangePercent, outHomeChangePercent, inHomeChangeValue, outHomeChangeValue } = prepareVerticalChartData(btwYearFilteredData, btwYearSelections.activity);
            setProcessedVerticalChartData(verticalData);

            setInHomeAverage(averages.inHomeAvg);
            setOutHomeAverage(averages.outHomeAvg);
            setMinYear(minYear);
            setMaxYear(maxYear);
            setInHomeChangePercent(inHomeChangePercent);
            setOutHomeChangePercent(outHomeChangePercent);
            setInHomeChangeValue(inHomeChangeValue);
            setOutHomeChangeValue(outHomeChangeValue);

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
                        title="Average time spent per person per day (min)" />
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