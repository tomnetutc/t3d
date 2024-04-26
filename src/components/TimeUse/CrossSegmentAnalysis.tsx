import React, { useState, useEffect, useCallback } from 'react';
import "../../css/timeuse.scss";
import SampleSizeTable from '../SampleSizeTable';
import ProfileCards from '../ProfileCard/ProfileCards';
import RechartsLineChart from '../LineChart/LineChart';
import CrossSegmentYearMenu from "./CrossSegmentYearMenu";
import { timeUse_crossSegmentColors } from "../../Colors";
import Infobox from '../InfoBox/InfoBox';
import { ActivityLocationOption, ActivityOption, ChartDataProps, CountObj, DataRow, GroupedOptions, Option, SampleSizeTableProps, weekOption } from "../Types";
import { ActivityOptions, CrossSegmentDataFilter, DataProvider, WeekOptions } from "../../utils/Helpers";
import { mean } from 'd3';

export const CrossSegmentAnalysis: React.FC<{ menuSelectedOptions: Option[][], toggleState: boolean, setIsCrossSegmentLoading: (isLoading: boolean) => void, onProfileRemove: (index: number) => void }> = ({ menuSelectedOptions, toggleState, setIsCrossSegmentLoading, onProfileRemove }) => {

    const [crossSegmentSelections, setCrossSegmentSelections] = useState<{ week: weekOption, activity: ActivityOption, activityLocation: ActivityLocationOption, startYear: string, endYear: string }>({ week: WeekOptions[0], activity: ActivityOptions[3], activityLocation: { label: "All", value: "All" }, startYear: "", endYear: "" });
    const [crossSegmentFilteredData, setCrossSegmentFilteredData] = useState<DataRow[]>([]);
    const [ChartData, setChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [sampleSizeTableData, setSampleSizeTableData] = useState<SampleSizeTableProps>({ years: [], counts: [] });

    const handleCrossSegmentMenuChange = useCallback((selections: { week: weekOption, activity: ActivityOption, activityLocation: ActivityLocationOption, startYear: string, endYear: string }) => {
        if (selections.activity === crossSegmentSelections.activity && selections.activityLocation == crossSegmentSelections.activityLocation && selections.week === crossSegmentSelections.week && selections.startYear === crossSegmentSelections.startYear && selections.endYear === crossSegmentSelections.endYear) {
            return;
        }
        setCrossSegmentSelections(selections);
    }, [crossSegmentSelections]);

    useEffect(() => {
        if (crossSegmentSelections.startYear === "" || crossSegmentSelections.endYear === "") {
            return;
        }

        setIsCrossSegmentLoading(true);

        Promise.all([
            CrossSegmentDataFilter(DataProvider.getInstance(), crossSegmentSelections.startYear, crossSegmentSelections.endYear, crossSegmentSelections.week, toggleState)
        ]).then(([FilteredData]) => {

            setCrossSegmentFilteredData(FilteredData);
            const { chartData, sampleSizeTableData } = prepareChartData(FilteredData, menuSelectedOptions, crossSegmentSelections.activity, crossSegmentSelections.activityLocation, crossSegmentSelections.startYear, crossSegmentSelections.endYear);
            setChartData(chartData);
            setSampleSizeTableData(sampleSizeTableData);

        }).finally(() => {
            setIsCrossSegmentLoading(false);
        });
    }, [crossSegmentSelections, menuSelectedOptions, toggleState]);

    return (
        <>
            <div className='home'>
                <CrossSegmentYearMenu onSelectionChange={handleCrossSegmentMenuChange} />
                <div className="crossSegment">
                    <div className="box SegmentDisplay">
                        <ProfileCards
                            profileList={menuSelectedOptions.slice(1).map(optionsArray => ({
                                'profile': optionsArray
                            }))}
                            removeProfile={index => onProfileRemove(index + 1)}
                            title="Segments"
                        />
                        <Infobox>
                            <p>i1</p>
                        </Infobox>
                    </div>
                    <div className='box MultiChartAvearge'>
                        <RechartsLineChart
                            chartData={ChartData}
                            title="Average time spent per person per day (min)"
                            showLegend={true}
                        />
                        <Infobox>
                            <p>i2</p>
                        </Infobox>
                    </div>
                </div>
                <div className="sampeSizeTable">
                    <SampleSizeTable years={sampleSizeTableData.years} counts={sampleSizeTableData.counts} crossSegment={true} />
                </div>
            </div>

        </>
    )
}

const prepareChartData = (filteredData: DataRow[], menuSelectedOptions: Option[][], selectedActivity: ActivityOption, activityLocation: ActivityLocationOption, startYear: string, endYear: string): {
    chartData: ChartDataProps,
    sampleSizeTableData: SampleSizeTableProps
} => {

    type ChartDataType = ChartDataProps['datasets'][number];

    let ChartDataSets: ChartDataType[] = [];
    let sampleSizeCounts: CountObj[] = [];

    const labels = Array.from(new Set(filteredData.map(item => item.year))).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    menuSelectedOptions.forEach((optionsGroup, index) => {

        let dataPoints: number[] = [];
        let yearlyCounts: [string, number][] = [];

        let optionFilteredData = [...filteredData];

        optionFilteredData = optionFilteredData.filter(row => {
            // Group options by groupId
            const groupedOptions = optionsGroup.reduce((acc: GroupedOptions, option) => {
                const groupId = option.groupId;
                acc[groupId] = acc[groupId] || [];
                acc[groupId].push(option);
                return acc;
            }, {});


            return Object.values(groupedOptions).every((group: Option[]) => {
                return group.some(option => {
                    const column = option.id;
                    const value = option.val;
                    return row[column] === value;
                });
            });
        });

        labels.forEach(year => {
            let avgValue = 0;
            let inHomeValue: any = 0, outHomeValue: any = 0, inHomeCMean = 0, outHomeCMean = 0;
            const yearData = optionFilteredData.filter(row => row.year === year);
            if (selectedActivity.value === 'All') {
                ActivityOptions.forEach(activity => {
                    if (activity.value === 'In-home') {
                        inHomeValue = mean(yearData, row => +row[activity.inHome]);
                    }
                    else if (activity.value === 'Out-home') {
                        outHomeValue = mean(yearData, row => +row[activity.outHome]);
                    }
                    else {
                        inHomeValue = mean(yearData, row => +row[activity.inHome]);
                        outHomeValue = mean(yearData, row => +row[activity.outHome]);
                    }

                    inHomeCMean += (inHomeValue === undefined ? 0 : inHomeValue);
                    outHomeCMean += (outHomeValue === undefined ? 0 : outHomeValue);
                });

                inHomeValue = inHomeCMean;
                outHomeValue = outHomeCMean; //Cummulative mean

            } else {
                if (activityLocation.value === 'All') {
                    inHomeValue = mean(yearData, row => +row[selectedActivity.inHome]);
                    outHomeValue = mean(yearData, row => +row[selectedActivity.outHome]);
                }
                else if (activityLocation.value === 'In-home') {
                    inHomeValue = mean(yearData, row => +row[selectedActivity.inHome]);
                }
                else {
                    outHomeValue = mean(yearData, row => +row[selectedActivity.outHome]);
                }
            }

            if (activityLocation.value === 'All') {
                avgValue = (inHomeValue === undefined ? 0 : inHomeValue) + (outHomeValue === undefined ? 0 : outHomeValue);
            } else if (activityLocation.value === 'In-home') {
                avgValue = (inHomeValue === undefined ? 0 : inHomeValue);
            } else {
                avgValue = (outHomeValue === undefined ? 0 : outHomeValue);
            }

            avgValue = parseFloat(avgValue.toFixed(1));
            dataPoints.push(avgValue);
        });

        ChartDataSets.push({
            label: (index == 0 ? 'All' : 'Segment ' + index),
            data: dataPoints,
            borderColor: timeUse_crossSegmentColors[index],
            backgroundColor: timeUse_crossSegmentColors[index],
            barThickness: 'flex',
        });

        // Prepare sample size counts
        const uniqueYears = Array.from(new Set(optionFilteredData.map(item => item.year)))
            .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

        uniqueYears.forEach(year => {
            yearlyCounts.push([year, optionFilteredData.filter(row => row.year === year).length]);
        });

        sampleSizeCounts.push({ data: optionFilteredData, count: yearlyCounts });

    });


    return {
        chartData: {
            labels: labels,
            datasets: ChartDataSets
        },
        sampleSizeTableData: {
            years: labels,
            counts: sampleSizeCounts
        }
    };

};