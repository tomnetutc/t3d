import React, { useState, useEffect, useCallback } from 'react';
import { weekOption, Option, ChartDataProps, BubbleDataProps } from "../Types";
import Segment from '../Segment/Segment';
import YearMenu from '../WithinYearMenu';
import { DataProvider, WeekOptions, fetchAndFilterData, getTotalRowsForYear } from "../../utils/Helpers";
import { calculateTimePoorWorkArrangementData, calculateWorkArrangementByDayOfWeek, calculateWorkArrangementData, generateWorkDurationChartData } from './ChartDataCalcuations';
import "../../css/telework.scss";
import { segmentShare, segmentSize, updateSegmentShare, updateSegmentSize } from "../data";
import { ChartData } from 'chart.js';
import PieChart from '../PieChart/PieChart';
import ChartComponent from '../Chart/Chart';
import { GridBubbleChart } from '../Bubble/Bubble';
import Infobox from '../InfoBox/InfoBox';

export const WithinYearAnalysis: React.FC<{ menuSelectedOptions: Option[], toggleState: boolean, setIsWithinYearLoading: (isLoading: boolean) => void }> = ({ menuSelectedOptions, toggleState, setIsWithinYearLoading }) => {

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [yearMenuSelections, setYearMenuSelections] = useState<{ week: weekOption, year: string, employment?: Option }>({ week: WeekOptions[0], year: "", employment: { label: "All", value: "All", id: "All", val: "All", groupId: "All" } });
    const [workArrangementData, setWorkArrangementData] = useState<ChartData<"pie", number[], string | string[]>>({ labels: [], datasets: [] });
    const [workDurationChartData, setWorkDurationChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [workArrangmentByDayOfWeek, setWorkArrangmentByDayOfWeek] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [timePoorWorkArrangementData, setTimePoorWorkArrangementData] = useState<BubbleDataProps[]>([]);

    const handleYearMenuChange = useCallback((selections: { week: weekOption, year: string, employment?: Option }) => {
        if (selections.year === yearMenuSelections.year && selections.week === yearMenuSelections.week && selections.employment === yearMenuSelections.employment) {
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
            fetchAndFilterData(DataProvider.getInstance(), menuSelectedOptions, selectedYear, weekOption, toggleState, true),
            getTotalRowsForYear(DataProvider.getInstance(), selectedYear, true)
        ]).then(([filteredData, totalRowsForYear]) => {

            if (yearMenuSelections.employment?.id != "All") {
                filteredData = filteredData.filter(row => row[yearMenuSelections.employment?.id ?? ''] === yearMenuSelections.employment?.val);
            }

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
    }, [menuSelectedOptions, yearMenuSelections, toggleState]);

    return (
        <>
            <div className='home'>
                <YearMenu onSelectionChange={handleYearMenuChange} callingComponent='Telework' />
                <div className="telework">
                    <div className="box WorkArrangementPie"><PieChart
                        title="Workers by work arrangement (%)"
                        data={workArrangementData}
                    />
                        <Infobox>
                            <p>The distribution of workers by work arrangement. For definitions of work arrangement groups, refer to the About page.</p>
                        </Infobox></div>
                    <div className="box SegmentSize"><Segment {...segmentSize} />
                        <Infobox>
                            <p>The total number of respondents in the selected segment within the year.</p>
                        </Infobox></div>
                    <div className="box SegmentShare"><Segment {...segmentShare} />
                        <Infobox>
                            <p>The proportion of the selected segment within the total sample for the year.</p>
                        </Infobox></div>
                    <div className="box WorkDurationChart"><ChartComponent
                        chartData={workDurationChartData}
                        title="Work duration by work arrangement (min)"
                        isStacked={true}
                        showLegend={true}
                    />
                        <Infobox>
                            <p>Average time spent on working per person per day across work arrangement groups, categorized by where the activity takes place: in-home vs. out-of-home.</p>
                        </Infobox></div>

                    <div className="box TimePoorArrangment"><GridBubbleChart
                        bubbleData={timePoorWorkArrangementData}
                        chartTitle="Percent of time poor by work arrangement (%)"
                    />
                        <Infobox>
                            <p>Percent of time poor workers in each work arrangement group. For more details on time poverty, see the About page.</p>
                        </Infobox></div>
                    <div className="box WorkArrangementChart"><ChartComponent
                        title='Workers by work arrangement (%) by day of week'
                        chartData={workArrangmentByDayOfWeek}
                        isStacked={true}
                        showLegend={true}
                        isTelework={true}
                    />
                        <Infobox>
                            <p>The distribution of workers by work arrangement across different days.</p>
                        </Infobox></div>


                </div>
            </div>
        </>
    )
}