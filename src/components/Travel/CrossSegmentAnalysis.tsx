import { useCallback, useEffect, useState } from "react";
import { CrossSegmentDataFilter, TravelDataProvider, TripPurposeOptions, WeekOptions } from "../../utils/Helpers";
import CrossSegmentYearMenu from "./CrossSegmentYearMenu";
import ProfileCards from "../ProfileCard/ProfileCards";
import SampleSizeTable from "../SampleSizeTable";
import Infobox from '../InfoBox/InfoBox';
import { mean } from "d3";
import { travel_crossSegmentColors } from "../../Colors";
import RechartsLineChart from "../LineChart/LineChart";
import {
    AnalysisTypeOption,
    ChartDataProps,
    CountObj,
    DataRow,
    GroupedOptions,
    Option,
    SampleSizeTableProps,
    TravelModeOption,
    TripPurposeOption,
    weekOption
} from "../Types";


export const CrossSegmentAnalysis: React.FC<{ menuSelectedOptions: Option[][], toggleState: boolean, setIsCrossSegmentLoading: (isLoading: boolean) => void, onProfileRemove: (index: number) => void }> = ({ menuSelectedOptions, toggleState, setIsCrossSegmentLoading, onProfileRemove }) => {

    const [crossSegmentSelections, setCrossSegmentSelections] = useState<{ week: weekOption, optionValue: TripPurposeOption | TravelModeOption, activeOption: string, analysisType: AnalysisTypeOption, startYear: string, endYear: string }>({ week: WeekOptions[0], optionValue: TripPurposeOptions[9], activeOption: "", analysisType: { label: "", value: "" }, startYear: "", endYear: "" });
    const [crossSegmentFilteredData, setCrossSegmentFilteredData] = useState<DataRow[]>([]);
    const [ChartData, setChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [sampleSizeTableData, setSampleSizeTableData] = useState<SampleSizeTableProps>({ years: [], counts: [] });
    const [chartTitle, setChartTitle] = useState<string>("Average number of trips per person");
    const [chartIButton, setChartIButton] = useState<string>("The average number of trips per person per day for each segment, calculated over the years from the start year to the end year.");

    const handleCrossSegmentMenuChange = useCallback((selections: { week: weekOption, optionValue: TripPurposeOption | TravelModeOption, activeOption: string, analysisType: AnalysisTypeOption, startYear: string, endYear: string }) => {
        if (selections.week === crossSegmentSelections.week && selections.optionValue == crossSegmentSelections.optionValue && selections.activeOption === crossSegmentSelections.activeOption && selections.analysisType === crossSegmentSelections.analysisType && selections.startYear === crossSegmentSelections.startYear && selections.endYear === crossSegmentSelections.endYear) {
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
            CrossSegmentDataFilter(TravelDataProvider.getInstance(), crossSegmentSelections.startYear, crossSegmentSelections.endYear, crossSegmentSelections.week, toggleState)
        ]).then(([FilteredData]) => {

            setCrossSegmentFilteredData(FilteredData);
            const { chartData, sampleSizeTableData } = prepareChartData(FilteredData, menuSelectedOptions, crossSegmentSelections.optionValue, crossSegmentSelections.activeOption, crossSegmentSelections.analysisType, crossSegmentSelections.startYear, crossSegmentSelections.endYear);
            setChartData(chartData);
            setSampleSizeTableData(sampleSizeTableData);

            if (crossSegmentSelections.analysisType.value == "NumberTrips") {
                setChartTitle("Average number of trips per person");
                setChartIButton("The average number of trips per person per day for each segment, calculated over the years from the start year to the end year.");
            }
            else {
                setChartTitle("Average travel duration per person (min)");
                setChartIButton("The average daily travel duration per person for each segment, calculated over the years from the start year to the end year.")
            }

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
                            <p>Add up to four additional user-defined segments for comparison purposes and display their characteristics.</p>
                        </Infobox>
                    </div>
                    <div className='box MultiChartAvearge'>
                        <RechartsLineChart
                            chartData={ChartData}
                            title={chartTitle}
                            showLegend={true}
                        />
                        <Infobox>
                            <p>{chartIButton}</p>
                        </Infobox>
                    </div>
                </div>
                <div className="sampeSizeTable">
                    <SampleSizeTable years={sampleSizeTableData.years} counts={sampleSizeTableData.counts} crossSegment={true} />
                    <Infobox style={{ padding: '20px' }}>
                        <p>Number of respondents per year for each segment.</p>
                    </Infobox>
                </div>
            </div>
        </>

    )
}

const prepareChartData = (filteredData: DataRow[], menuSelectedOptions: Option[][], optionValue: TripPurposeOption | TravelModeOption, activeOption: string, analysisType: AnalysisTypeOption, startYear: string, endYear: string): {
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
            const yearData = optionFilteredData.filter(row => row.year === year);
            let meanValue;

            if (analysisType.value == "NumberTrips") {
                meanValue = mean(yearData, row => +row[optionValue.numberTrip]);
            }
            else {
                meanValue = mean(yearData, row => +row[optionValue.durationTrips]);
            }

            if (meanValue !== undefined) {
                if (analysisType.value == "NumberTrips") {
                    meanValue = parseFloat(meanValue.toFixed(2));
                }
                else {
                    meanValue = parseFloat(meanValue.toFixed(1));
                }
                dataPoints.push(meanValue);
            } else {
                dataPoints.push(0); // Push a default value if no data is available
            }
        });

        ChartDataSets.push({
            label: (index == 0 ? 'All' : 'Segment ' + index),
            data: dataPoints,
            borderColor: travel_crossSegmentColors[index],
            backgroundColor: travel_crossSegmentColors[index],
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