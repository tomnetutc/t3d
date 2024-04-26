import React, { useState, useEffect, useCallback } from 'react';
import "../../css/telework.scss";
import { ChartDataProps, CountObj, DataRow, GroupedOptions, Option, SampleSizeTableProps, weekOption } from "../Types";
import { CrossSegmentDataFilter, DataProvider, WeekOptions } from '../../utils/Helpers';
import ProfileCards from '../ProfileCard/ProfileCards';
import CrossSegmentYearMenu from './CrossSegmentYearMenu';
import { mean } from "d3";
import Infobox from '../InfoBox/InfoBox';
import { telework_crossSegmentColors } from '../../Colors';
import RechartsLineChart from '../LineChart/LineChart';
import SampleSizeTable from '../SampleSizeTable';

export const CrossSegmentAnalysis: React.FC<{ menuSelectedOptions: Option[][], toggleState: boolean, setIsCrossSegmentLoading: (isLoading: boolean) => void, onProfileRemove: (index: number) => void }> = ({ menuSelectedOptions, toggleState, setIsCrossSegmentLoading, onProfileRemove }) => {

    const [crossSegmentSelections, setCrossSegmentSelections] = useState<{ week: weekOption, workArrangement: Option, employment: Option, startYear: string, endYear: string }>({ week: WeekOptions[0], workArrangement: { label: "All", value: "All", id: "All", val: "All", groupId: "All" }, employment: { label: "All", value: "All", id: "All", val: "All", groupId: "All" }, startYear: "", endYear: "" });
    const [crossSegmentFilteredData, setCrossSegmentFilteredData] = useState<DataRow[]>([]);
    const [ChartData, setChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [sampleSizeTableData, setSampleSizeTableData] = useState<SampleSizeTableProps>({ years: [], counts: [] });


    const handleCrossSegmentMenuChange = useCallback((selections: { week: weekOption; workArrangement: Option; employment: Option, startYear: string; endYear: string; }) => {
        if (selections.workArrangement === crossSegmentSelections.workArrangement && selections.week === crossSegmentSelections.week && selections.startYear === crossSegmentSelections.startYear && selections.endYear === crossSegmentSelections.endYear && selections.employment === crossSegmentSelections.employment) {
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
            CrossSegmentDataFilter(DataProvider.getInstance(), crossSegmentSelections.startYear, crossSegmentSelections.endYear, crossSegmentSelections.week, toggleState, true)
        ]).then(([FilteredData]) => {

            setCrossSegmentFilteredData(FilteredData);
            const { chartData, sampleSizeTableData } = prepareChartData(FilteredData, menuSelectedOptions, crossSegmentSelections.workArrangement, crossSegmentSelections.employment, crossSegmentSelections.startYear, crossSegmentSelections.endYear);

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
                <div className="crossSegmentTelework">
                    <div className="box SegmentDisplay">
                        <ProfileCards
                            profileList={menuSelectedOptions.slice(1).map(optionsArray => ({
                                'profile': optionsArray
                            }))}
                            removeProfile={index => onProfileRemove(index + 1)}
                            title="Segments"
                        />
                        <Infobox>
                            <p>i5</p>
                        </Infobox>
                    </div>
                    <div className='box MultiChartAvearge'>
                        <RechartsLineChart
                            chartData={ChartData}
                            title="Work arrangement share (%)"
                            showLegend={true}
                        />
                        <Infobox>
                            <p>i6</p>
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

const prepareChartData = (filteredData: DataRow[], menuSelectedOptions: Option[][], workArrangement: Option, employment: Option, startYear: string, endYear: string): {
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


        if (employment.id != "All") {
            optionFilteredData = optionFilteredData.filter(row => row[employment.id] === employment.val);
        }

        if (workArrangement.id != "All") {
            labels.forEach(year => {
                const yearData = optionFilteredData.filter(row => row.year === year);
                const meanValue = mean(yearData, row => +row[workArrangement.id]);
                if (meanValue !== undefined) {
                    let percentValue = meanValue * 100;
                    percentValue = parseFloat(percentValue.toFixed(1));
                    dataPoints.push(percentValue);
                } else {
                    dataPoints.push(0); // Push a default value if no data is available
                }
            });
        }
        else {
            labels.forEach(year => {
                if (optionFilteredData.filter(row => row.year === year).length > 0) {
                    dataPoints.push(100.0); // Push a default 100 % as value if 'All' in work arrangement is selected
                }
                else {
                    dataPoints.push(0); // Push a default value if no data is available
                }
            });
        }

        ChartDataSets.push({
            label: (index == 0 ? 'All' : 'Segment ' + index),
            data: dataPoints,
            borderColor: telework_crossSegmentColors[index],
            backgroundColor: telework_crossSegmentColors[index],
            barThickness: 'flex',
        });

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
