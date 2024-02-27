import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { weekOption, Option, ChartDataProps, BubbleDataProps } from "../Types";
import Segment from '../Segment/Segment';
import YearMenu from '../WithinYearMenu';
import { DataProvider, WeekOptions, fetchAndFilterData, getTotalRowsForYear } from "../../utils/Helpers";
import { calculateTimePoorWorkArrangementData, calculateWorkArrangementByDayOfWeek, calculateWorkArrangementData, generateWorkDurationChartData } from './ChartDataCalcuations';
import "../../css/telework.scss";
import { segmentShare, segmentSize, updateSegmentShare, updateSegmentSize } from "../data";
import { ChartData } from 'chart.js';
import PieChart from '../PieChart/PieChart';
import VerticalStackedBarChart from '../VerticalChart/VerticalChart';
import { set } from 'lodash';
import ChartComponent from '../Chart/Chart';
import RechartsAreaChart from '../AreaChart/AreaChart';
import BubbleChart, { GridBubbleChart } from '../Bubble/Bubble';

export const WithinYearAnalysis: React.FC<{ menuSelectedOptions: Option[], setIsWithinYearLoading: (isLoading: boolean) => void }> = ({ menuSelectedOptions, setIsWithinYearLoading }) => {

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [yearMenuSelections, setYearMenuSelections] = useState<{ week: weekOption, year: string }>({ week: WeekOptions[0], year: "" });
    const [workArrangementData, setWorkArrangementData] = useState<ChartData<"pie", number[], string | string[]>>({ labels: [], datasets: [] });
    const [workDurationChartData, setWorkDurationChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [workArrangmentByDayOfWeek, setWorkArrangmentByDayOfWeek] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [timePoorWorkArrangementData, setTimePoorWorkArrangementData] = useState<BubbleDataProps[]>([]);

    const handleYearMenuChange = useCallback((selections: { week: weekOption, year: string }) => {
        if (selections.year === yearMenuSelections.year && selections.week === yearMenuSelections.week) {
            return;
        }
        setYearMenuSelections(selections);
    }, [yearMenuSelections]);

    useEffect(() => {
        const selectedYear = yearMenuSelections.year;
        const weekOption = yearMenuSelections.week;

        if (!yearMenuSelections.year) {
            return;
        }

        setIsWithinYearLoading(true);

        Promise.all([
            fetchAndFilterData(DataProvider.getInstance(), menuSelectedOptions, selectedYear, weekOption, true),
            getTotalRowsForYear(DataProvider.getInstance(), selectedYear, true)
        ]).then(([filteredData, totalRowsForYear]) => {

            updateSegmentSize(filteredData.length);
            updateSegmentShare(filteredData.length, totalRowsForYear);
            setFilteredData(filteredData);

            setWorkArrangementData(calculateWorkArrangementData(filteredData));
            setWorkDurationChartData(generateWorkDurationChartData(filteredData));
            setWorkArrangmentByDayOfWeek(calculateWorkArrangementByDayOfWeek(filteredData, weekOption));
            setTimePoorWorkArrangementData(calculateTimePoorWorkArrangementData(filteredData));

        }).finally(() => {
            setIsWithinYearLoading(false);
        });
    }, [menuSelectedOptions, yearMenuSelections]);

    return (
        <>
            <div className='home'>
                <YearMenu onSelectionChange={handleYearMenuChange} callingComponent='Telework' />
                <div className="telework">
                    <div className="box WorkArrangementPie"><PieChart
                        title="Workers by work arrangement (%)"
                        data={workArrangementData}
                    /></div>
                    <div className="box SegmentSize"><Segment {...segmentSize} /></div>
                    <div className="box SegmentShare"><Segment {...segmentShare} /></div>
                    <div className="box WorkDurationChart"><ChartComponent
                        chartData={workDurationChartData}
                        title="Work duration by work arrangement (min)"
                        isStacked={true}
                        showLegend={true}
                    /></div>

                    <div className="box box5"><GridBubbleChart
                        bubbleData={timePoorWorkArrangementData}
                        chartTitle="Percent of time poor by work arrangement"

                    /></div>
                    <div className="box WorkArrangementChart"><ChartComponent
                        title='Workers by work arrangement (%) by day of week'
                        chartData={workArrangmentByDayOfWeek}
                        isStacked={true}
                        showLegend={true}
                        isTelework={true}
                    /></div>


                </div>
            </div>
        </>
    )
}