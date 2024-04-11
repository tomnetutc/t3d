import React, { useState, useEffect, useCallback } from 'react';
import "../../css/timeuse.scss";
import BtwYearMenu from './BtwYearMenu';
import BubbleChart from '../Bubble/Bubble';
import VerticalStackedBarChart from '../VerticalChart/VerticalChart';
import DualValueSegment from '../DualValueSegment/DualValueSegment';
import { prepareVerticalChartData } from './BtwYearDataCalculations';
import { ActivityOption, ChartDataProps, Option, SampleSizeTableProps, weekOption } from "../Types";
import { DataProvider, WeekOptions, fetchAndFilterDataForBtwYearAnalysis } from "../../utils/Helpers";
import Infobox from '../InfoBox/InfoBox';
import SampleSizeTable from '../SampleSizeTable';


export const BtwYearAnalysis: React.FC<{ menuSelectedOptions: Option[], toggleState: boolean, setIsBtwYearLoading: (isLoading: boolean) => void }> = ({ menuSelectedOptions, toggleState, setIsBtwYearLoading }) => {

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
    const [sampleSizeTableData, setSampleSizeTableData] = useState<SampleSizeTableProps>({ years: [], counts: [] });


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
            fetchAndFilterDataForBtwYearAnalysis(DataProvider.getInstance(), menuSelectedOptions, btwYearSelections.week, toggleState) //filtering for activity type is done in prepareVerticalChartData function
        ]).then(([btwYearFilteredData]) => {
            setBtwYearFilteredData(btwYearFilteredData);

            const { chartData: verticalData, averages, minYear, maxYear, inHomeChangePercent, outHomeChangePercent, inHomeChangeValue, outHomeChangeValue, sampleSizeTableData } = prepareVerticalChartData(btwYearFilteredData, btwYearSelections.activity, btwYearSelections.startYear, btwYearSelections.endYear);
            setProcessedVerticalChartData(verticalData);

            setInHomeAverage(averages.inHomeAvg);
            setOutHomeAverage(averages.outHomeAvg);
            setMinYear(minYear);
            setMaxYear(maxYear);
            setInHomeChangePercent(inHomeChangePercent);
            setOutHomeChangePercent(outHomeChangePercent);
            setInHomeChangeValue(inHomeChangeValue);
            setOutHomeChangeValue(outHomeChangeValue);
            setSampleSizeTableData(sampleSizeTableData);

        }).finally(() => {
            setIsBtwYearLoading(false);
        });
    }, [menuSelectedOptions, btwYearSelections, toggleState]);


    return (
        <>
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
                        <Infobox>
                            <p>Average time spent in-home vs. out-of-home per person per day within the selected period.</p>
                        </Infobox>
                    </div>

                    <div className="box ChartAverage"><VerticalStackedBarChart
                        chartData={processedVerticalChartData}
                        title="Average time spent per person per day (min)"
                        isStacked={true}
                        showLegend={true} />
                        <Infobox>
                            <p>Average daily time spent in-home vs. out-of-home per person per year during the selected period.</p>
                        </Infobox>
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
                        <Infobox>
                            <p>Change in time allocations for in-home and out-of-home activities from the start year to the end year, expressed in both absolute and percentage terms.</p>
                        </Infobox>
                    </div>
                </div>

                <div className="sampeSizeTable">
                    <SampleSizeTable years={sampleSizeTableData.years} counts={sampleSizeTableData.counts} />
                </div>

            </div>
        </>
    )
}