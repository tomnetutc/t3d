import { useCallback, useEffect, useState } from "react";
import { ChartDataProps, weekOption, Option, ProgressBarData, SampleSizeTableProps, DataRow } from "../Types";
import { DataProvider, WeekOptions, fetchAndFilterDataForBtwYearAnalysis } from "../../utils/Helpers";
import BtwYearMenu from "./BtwYearMenu";
import VerticalStackedBarChart from "../VerticalChart/VerticalChart";
import { calculateYearlyWorkArrangementShares } from "./BtwYearDataCalculations";
import Progress from "../ProgressBar/ProgressBar";
import Infobox from '../InfoBox/InfoBox';
import SampleSizeTable from "../SampleSizeTable";

export const BtwYearAnalysis: React.FC<{ menuSelectedOptions: Option[], toggleState: boolean, setIsBtwYearLoading: (isLoading: boolean) => void }> = ({ menuSelectedOptions, toggleState, setIsBtwYearLoading }) => {

    const [btwYearFilteredData, setBtwYearFilteredData] = useState<DataRow[]>([]);
    const [btwYearSelections, setBtwYearSelections] = useState<{ week: weekOption, employment: Option, startYear: string, endYear: string }>({ week: WeekOptions[0], employment: { label: "All", value: "All", id: "All", val: "All", groupId: "All" }, startYear: "", endYear: "" });
    const [workersShare, setworkersShareChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [percentageChange, setPercentageChange] = useState<ProgressBarData[]>([]);
    const [sampleSizeTableData, setSampleSizeTableData] = useState<SampleSizeTableProps>({ years: [], counts: [] });
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
            fetchAndFilterDataForBtwYearAnalysis(DataProvider.getInstance(), menuSelectedOptions, btwYearSelections.week, toggleState, true)
        ]).then(([btwYearFilteredData]) => {
            setBtwYearFilteredData(btwYearFilteredData);

            const { chartData, percentChangedata, minYear, maxYear, sampleSizeTableData } = calculateYearlyWorkArrangementShares(btwYearFilteredData, btwYearSelections.startYear, btwYearSelections.endYear, btwYearSelections.employment);

            setworkersShareChartData(chartData);
            setPercentageChange(percentChangedata);
            setMinYear(minYear);
            setMaxYear(maxYear);
            setSampleSizeTableData(sampleSizeTableData);


        }).finally(() => {
            setIsBtwYearLoading(false);
        });

    }, [menuSelectedOptions, btwYearSelections, toggleState]);

    return (
        <>
            <div className='home'>

                <BtwYearMenu onSelectionChange={handleBtwYearMenuChange} />
                <div className="betweenYearTelework">
                    <div className="box PercentageChangeProgress"><Progress
                        title={`Percent change from ${minYear} to ${maxYear}`}
                        data={percentageChange}
                    />
                        <Infobox>
                            <p>Change in the percentage of work arrangement groups from the start year to the end year.</p>
                        </Infobox></div>
                    <div className="box WorkArrangementBtwYearChart"><VerticalStackedBarChart
                        chartData={workersShare}
                        title="Share of workers by work arrangement (%)"
                        isStacked={true}
                        showLegend={true}
                        isTelework={true}
                    />
                        <Infobox>
                            <p>The distribution of workers by work arrangement over the selected period.</p>
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