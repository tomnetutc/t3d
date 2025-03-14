import { useCallback, useEffect, useState } from "react";
import BtwYearMenu from "./BtwYearMenu";
import { ChartDataProps, TravelModeOption, TripPurposeOption, weekOption, Option, SampleSizeTableProps, DataRow } from "../Types";
import { TravelDataProvider, TripPurposeOptions, WeekOptions, fetchAndFilterDataForBtwYearAnalysis } from "../../utils/Helpers";
import "../../css/travel.scss";
import { prepareVerticalChartData } from "./BtwYearDataCalculations";
import MaterialsTable from "../Table/Table";
import Infobox from '../InfoBox/InfoBox';
import SampleSizeTable from "../SampleSizeTable";
import RechartsLineChart from "../LineChart/LineChart";


export const BtwYearAnalysis: React.FC<{ menuSelectedOptions: Option[], toggleState: boolean, setIsBtwYearLoading: (isLoading: boolean) => void }> = ({ menuSelectedOptions, toggleState, setIsBtwYearLoading }) => {

    const [btwYearFilteredData, setBtwYearFilteredData] = useState<DataRow[]>([]);
    const [btwYearSelections, setBtwYearSelections] = useState<{ week: weekOption, optionValue: TripPurposeOption[] | TravelModeOption[], activeOption: string, startYear: string, endYear: string }>({ week: WeekOptions[0], optionValue: [TripPurposeOptions[9]], activeOption: "", startYear: "", endYear: "" });
    const [tripChartData, setTripChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [durationChartData, setDurationChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [optionChanges, setOptionChanges] = useState<any>({});
    const [sampleSizeTableData, setSampleSizeTableData] = useState<SampleSizeTableProps>({ years: [], counts: [] });
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');


    const handleBtwYearMenuChange = useCallback((selections: { week: weekOption, optionValue: TripPurposeOption[] | TravelModeOption[], activeOption: string, startYear: string, endYear: string }) => {
        if (selections.optionValue === btwYearSelections.optionValue && selections.activeOption === btwYearSelections.activeOption && selections.week === btwYearSelections.week && selections.startYear === btwYearSelections.startYear && selections.endYear === btwYearSelections.endYear) {
            return;
        };
        setBtwYearSelections(selections);
    }, [btwYearSelections]);

    useEffect(() => {

        if (btwYearSelections.startYear === '' || btwYearSelections.endYear === '' || btwYearSelections.activeOption === '') {
            return;
        }

        setIsBtwYearLoading(true);

        Promise.all([
            fetchAndFilterDataForBtwYearAnalysis(TravelDataProvider.getInstance(), menuSelectedOptions, btwYearSelections.week, toggleState)
        ]).then(([btwYearFilteredData]) => {

            const { tripsChartData, durationChartData, minYear, maxYear, optionChanges, sampleSizeTableData } = prepareVerticalChartData(btwYearFilteredData, btwYearSelections.optionValue, btwYearSelections.activeOption, btwYearSelections.startYear, btwYearSelections.endYear);

            setBtwYearFilteredData(btwYearFilteredData);
            setTripChartData(tripsChartData);
            setDurationChartData(durationChartData);
            setMinYear(minYear);
            setMaxYear(maxYear);
            setOptionChanges(optionChanges);
            setSampleSizeTableData(sampleSizeTableData);

        }).finally(() => {
            setIsBtwYearLoading(false);
        });

    }, [menuSelectedOptions, btwYearSelections, toggleState]);

    return (
        <>
            <div className='home'>

                <BtwYearMenu onSelectionChange={handleBtwYearMenuChange} />
                <div className="betweenYearTravel">
                    <div className="box TripModeChangesComponent"><MaterialsTable
                        title={`Change from ${minYear} to ${maxYear}`}
                        optionChanges={optionChanges}
                        activeOption={btwYearSelections.activeOption}
                        displayType="Trips"
                    />
                        <Infobox>
                            <p>Change in the number of trips per person from the start year to the end year, expressed in both absolute and percentage terms.</p>
                        </Infobox></div>
                    <div className="box NumberTripsBtwYearChartComponent"><RechartsLineChart
                        chartData={tripChartData}
                        title="Average number of trips per person"
                        showLegend={true}
                    />
                        <Infobox>
                            <p>The average number of trips per person per day, calculated over the years from the start year to the end year.</p>
                        </Infobox></div>
                    <div className="box TravelModeChangesComponent"><MaterialsTable
                        title={`Change from ${minYear} to ${maxYear}`}
                        optionChanges={optionChanges}
                        activeOption={btwYearSelections.activeOption}
                        displayType="Duration"
                    />
                        <Infobox>
                            <p>Change in daily travel duration per person from the start year to the end year, expressed in both absolute and percentage terms.</p>
                        </Infobox></div>
                    <div className="box DurationTripsBtwYearChartComponent"><RechartsLineChart
                        chartData={durationChartData}
                        title="Average travel duration per person (min)"
                        showLegend={true}
                    />
                        <Infobox>
                            <p>The average daily travel duration per person, calculated over the years from the start year to the end year.</p>
                        </Infobox></div>
                </div>
                <div className="sampeSizeTable">
                    <SampleSizeTable years={sampleSizeTableData.years} counts={sampleSizeTableData.counts} />
                    <Infobox style={{ padding: '20px' }}>
                        <p>Number of respondents per year for the selected segment. It is displayed for “All” by default.</p>
                    </Infobox>
                </div>
            </div>
        </>
    )
}
