import { useCallback, useEffect, useState } from "react";
import BtwYearMenu from "./BtwYearMenu";
import { ChartDataProps, MenuSelectedProps, TravelModeOption, TripPurposeOption, weekOption, Option } from "../Types";
import { TravelDataProvider, TripPurposeOptions, WeekOptions, fetchAndFilterDataForBtwYearAnalysis } from "../../utils/Helpers";
import "../../css/travel.scss";
import { prepareVerticalChartData } from "./BtwYearDataCalculations";
import LineChart from "../LineChart/LineChart";
import MaterialsTable from "../Table/Table";
import RechartsAreaChart from "../AreaChart/AreaChart";


export const BtwYearAnalysis: React.FC<{ menuSelectedOptions: Option[], setIsBtwYearLoading: (isLoading: boolean) => void }> = ({ menuSelectedOptions, setIsBtwYearLoading }) => {

    const [btwYearFilteredData, setBtwYearFilteredData] = useState<any[]>([]);
    const [btwYearSelections, setBtwYearSelections] = useState<{ week: weekOption, optionValue: TripPurposeOption | TravelModeOption, activeOption: string, startYear: string, endYear: string }>({ week: WeekOptions[0], optionValue: TripPurposeOptions[9], activeOption: "", startYear: "", endYear: "" });
    const [tripChartData, setTripChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [durationChartData, setDurationChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [optionChanges, setOptionChanges] = useState<any>({});
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');


    const handleBtwYearMenuChange = useCallback((selections: { week: weekOption, optionValue: TripPurposeOption | TravelModeOption, activeOption: string, startYear: string, endYear: string }) => {
        if (selections.optionValue === btwYearSelections.optionValue && selections.activeOption === btwYearSelections.activeOption && selections.week === btwYearSelections.week && selections.startYear === btwYearSelections.startYear && selections.endYear === btwYearSelections.endYear) {
            return;
        };
        setBtwYearSelections(selections);
    }, [btwYearSelections]);

    useEffect(() => {

        if (btwYearSelections.startYear === '' || btwYearSelections.endYear === '' || btwYearSelections.activeOption === '') {
            return;
        }

        Promise.all([
            fetchAndFilterDataForBtwYearAnalysis(TravelDataProvider.getInstance(), menuSelectedOptions, btwYearSelections.week)
        ]).then(([btwYearFilteredData]) => {
            setBtwYearFilteredData(btwYearFilteredData);

            const { tripsChartData, durationChartData, minYear, maxYear, optionChanges } = prepareVerticalChartData(btwYearFilteredData, btwYearSelections.optionValue, btwYearSelections.activeOption, btwYearSelections.startYear, btwYearSelections.endYear);

            setTripChartData(tripsChartData);
            setDurationChartData(durationChartData);
            setMinYear(minYear);
            setMaxYear(maxYear);
            setOptionChanges(optionChanges);

        }).finally(() => {
            setIsBtwYearLoading(false);
        });

    }, [menuSelectedOptions, btwYearSelections]);

    return (
        <>
            <div className='home' style={{ padding: '20px 0' }}>

                <BtwYearMenu onSelectionChange={handleBtwYearMenuChange} />
                <div className="betweenYearTravel">
                    <div className="box TripModeChangesComponent"><MaterialsTable
                        title={`Change from ${minYear} to ${maxYear}`}
                        optionChanges={optionChanges}
                        activeOption={btwYearSelections.activeOption}
                        displayType="Trips"
                    /></div>
                    <div className="box NumberTripsBtwYearChartComponent"><LineChart
                        chartData={tripChartData}
                        title="Average number of trips per person"
                        showLegend={false}
                    /></div>
                    <div className="box TravelModeChangesComponent"><MaterialsTable
                        title={`Change from ${minYear} to ${maxYear}`}
                        optionChanges={optionChanges}
                        activeOption={btwYearSelections.activeOption}
                        displayType="Duration"
                    /></div>
                    <div className="box DurationTripsBtwYearChartComponent"><RechartsAreaChart
                        chartData={durationChartData}
                        title="Average travel duration per person (min)"
                        showLegend={false}
                    /></div>
                </div>

            </div>
        </>
    )
}
