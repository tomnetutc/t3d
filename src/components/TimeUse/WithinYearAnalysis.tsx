import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChartData } from 'chart.js';
import "../../css/timeuse.scss";
import Donut from '../Donut/Donut';
import Segment from '../Segment/Segment';
import YearMenu from '../WithinYearMenu';
import ChartComponent from '../Chart/Chart';
import { ChartDataProps, Option, weekOption } from "../Types";
import { prepareChartData } from '../../components/TimeUse/ChartDataCalculations';
import { segmentActivites, segmentShare, segmentSize, segmentTimeSpent } from "../../components/data";
import { updateSegmentSize, updateSegmentShare, updateSegmentActivities, updateSegmentTimeSpent } from "../../components/data";
import {
    DataProvider,
    WeekOptions,
    fetchAndFilterData,
    getTotalRowsForYear
} from "../../utils/Helpers";

export const WithinYearAnalysis: React.FC<{ menuSelectedOptions: Option[], setIsWithinYearLoading: (isLoading: boolean) => void }> = ({ menuSelectedOptions, setIsWithinYearLoading }) => {

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [yearMenuSelections, setYearMenuSelections] = useState<{ week: weekOption, year: string }>({ week: WeekOptions[0], year: "" });
    const [timePovertyData, setTimePovertyData] = useState<ChartData<"doughnut", number[], unknown>>({ labels: [], datasets: [] });
    const [allocationData, setAllocationData] = useState<ChartData<"doughnut", number[], unknown>>({ labels: [], datasets: [] });
    const [processedChartData, setProcessedChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });

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
            fetchAndFilterData(DataProvider.getInstance(), menuSelectedOptions, selectedYear, weekOption),
            getTotalRowsForYear(DataProvider.getInstance(), selectedYear)
        ]).then(([filteredData, totalRowsForYear]) => {
            let totalOutTime = 0, totalActivities = 0, totalNecessary = 0, totalCommitted = 0;
            let timePoorCount = 0;

            //Segment data
            filteredData.forEach(row => {
                totalOutTime += parseFloat(row.out_total || '0');
                totalActivities += parseFloat(row.num_act || '0');
                totalNecessary += parseFloat(row.necessary || '0');
                totalCommitted += parseFloat(row.committed || '0');
                if (row.time_poor === '1.0') timePoorCount++;
            });

            const averageTimeSpent = filteredData.length > 0 ? totalOutTime / filteredData.length : 0;
            const averageActivities = filteredData.length > 0 ? totalActivities / filteredData.length : 0;

            updateSegmentSize(filteredData.length);
            updateSegmentShare(filteredData.length, totalRowsForYear);
            updateSegmentTimeSpent(averageTimeSpent);
            updateSegmentActivities(averageActivities);
            setFilteredData(filteredData);

            // Donut chart data
            const timePoorPercentage = parseFloat(((timePoorCount / filteredData.length) * 100).toFixed(1));
            const nonTimePoorPercentage = parseFloat((100 - timePoorPercentage).toFixed(1));

            const necessaryPercentage = parseFloat(((totalNecessary / filteredData.length) / 2400 * 100).toFixed(1));
            const committedPercentage = parseFloat(((totalCommitted / filteredData.length) / 2400 * 100).toFixed(1));
            const discretionaryPercentage = parseFloat((100 - necessaryPercentage - committedPercentage).toFixed(1));

            setTimePovertyData({
                labels: ['Time poor', 'Non-time poor'],
                datasets: [{
                    data: [timePoorPercentage, nonTimePoorPercentage],
                    backgroundColor: ['#8E9B97', '#EAD97C'],
                    borderColor: ['#8E9B97', '#EAD97C'],
                    borderWidth: 1
                }]
            });

            setAllocationData({
                labels: ['Necessary', 'Discretionary', 'Committed'],
                datasets: [{
                    data: [necessaryPercentage, discretionaryPercentage, committedPercentage],
                    backgroundColor: ['#8E9B97', '#F9A875', '#657383'],
                    borderColor: ['#8E9B97', '#F9A875', '#657383'],
                    borderWidth: 1
                }]
            });

            // Horizontal Chart data
            const chartData = prepareChartData(filteredData);
            setProcessedChartData(chartData);
        }).finally(() => {
            setIsWithinYearLoading(false);
        });
    }, [menuSelectedOptions, yearMenuSelections]);

    return (
        <>
            <div className='home'>

                <YearMenu onSelectionChange={handleYearMenuChange} />
                <div className="timeUse">
                    <div className="box SegmentSize"><Segment {...segmentSize} /></div>
                    <div className="box SegmentShare"><Segment {...segmentShare} /></div>
                    <div className="box SegmentTimeSpent"><Segment {...segmentTimeSpent} /></div>
                    <div className="box SegmentActivities"><Segment {...segmentActivites} /></div>
                    <div className="box DonutAllocation"><Donut
                        title="Time allocation by activity type"
                        data={allocationData}
                        aspectRatio={1.2} /></div>
                    <div className="box ChartComponent"><ChartComponent
                        chartData={processedChartData}
                        title='Average time spent per person per day (min)'
                        isStacked={true}
                        showLegend={true} /></div>
                    <div className="box DonutPoverty"><Donut
                        title="Time poverty"
                        data={timePovertyData}
                        aspectRatio={1.2} /></div>
                </div>

            </div>
        </>
    )
}