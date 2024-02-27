import { useCallback, useEffect, useState } from "react";
import { ChartDataProps, weekOption, Option, ProgressBarData } from "../Types";
import { DataProvider, WeekOptions, fetchAndFilterDataForBtwYearAnalysis } from "../../utils/Helpers";
import BtwYearMenu from "./BtwYearMenu";
import VerticalStackedBarChart from "../VerticalChart/VerticalChart";
import { calculateYearlyWorkArrangementShares } from "./BtwYearDataCalculations";
import Progress from "../ProgressBar/ProgressBar";

export const BtwYearAnalysis: React.FC<{ menuSelectedOptions: Option[], setIsBtwYearLoading: (isLoading: boolean) => void }> = ({ menuSelectedOptions, setIsBtwYearLoading }) => {

    const [btwYearFilteredData, setBtwYearFilteredData] = useState<any[]>([]);
    const [btwYearSelections, setBtwYearSelections] = useState<{ week: weekOption, employment: Option, startYear: string, endYear: string }>({ week: WeekOptions[0], employment: { label: "All", value: "All", id: "All", val: "All", groupId: "All" }, startYear: "", endYear: "" });
    const [workersShare, setworkersShareChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [percentageChange, setPercentageChange] = useState<ProgressBarData[]>([]);
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');

    const handleBtwYearMenuChange = useCallback((selections: { week: weekOption, employment: Option, startYear: string, endYear: string }) => {
        if (selections.employment === btwYearSelections.employment && selections.week === btwYearSelections.week && selections.startYear === btwYearSelections.startYear && selections.endYear === btwYearSelections.endYear) {
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
            fetchAndFilterDataForBtwYearAnalysis(DataProvider.getInstance(), menuSelectedOptions, btwYearSelections.week, true)
        ]).then(([btwYearFilteredData]) => {
            setBtwYearFilteredData(btwYearFilteredData);

            const { chartData, percentChangedata, minYear, maxYear } = calculateYearlyWorkArrangementShares(btwYearFilteredData, btwYearSelections.startYear, btwYearSelections.endYear, btwYearSelections.employment);

            setworkersShareChartData(chartData);
            setPercentageChange(percentChangedata);
            setMinYear(minYear);
            setMaxYear(maxYear);

        }).finally(() => {
            setIsBtwYearLoading(false);
        });

    }, [menuSelectedOptions, btwYearSelections]);

    return (
        <>
            <div className='home' style={{ padding: '20px 0' }}>

                <BtwYearMenu onSelectionChange={handleBtwYearMenuChange} />
                <div className="betweenYearTelework">
                    <div className="box PercentageChangeProgress"><Progress
                        title={`Percent change from ${minYear} to ${maxYear}`}
                        data={percentageChange}
                    /></div>
                    <div className="box WorkArrangementBtwYearChart"><VerticalStackedBarChart
                        chartData={workersShare}
                        title="Share of workers by work arrangement (%)"
                        isStacked={true}
                        showLegend={true}
                        isTelework={true}
                    /></div>
                </div>
            </div>
        </>
    )
}