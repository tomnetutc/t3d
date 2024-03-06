import { useCallback, useEffect, useState } from "react";
import { ChartDataProps, MenuSelectedProps, weekOption, Option } from "../Types";
import YearMenu from "../WithinYearMenu";
import { TravelDataProvider, WeekOptions, fetchAndFilterData, getTotalRowsForYear } from "../../utils/Helpers";
import Segment from "../Segment/Segment";
import { segmentShare, segmentSize, segmentTravel, segmentTrips, updateSegmentShare, updateSegmentSize, updateSegmentTravel, updateSegmentTrips } from "../data";
import "../../css/travel.scss";
import { ChartData } from "chart.js";
import Donut from "../Donut/Donut";
import { prepareChartData } from "./ChartDataCalculations";
import ChartComponent from "../Chart/Chart";
import VerticalStackedBarChart from "../VerticalChart/VerticalChart";
import Infobox from '../InfoBox/InfoBox';
import Colors from '../../Colors'


export const WithinYearAnalysis: React.FC<{ menuSelectedOptions: Option[], setIsWithinYearLoading: (isLoading: boolean) => void }> = ({ menuSelectedOptions, setIsWithinYearLoading }) => {

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [yearMenuSelections, setYearMenuSelections] = useState<{ week: weekOption, year: string }>({ week: WeekOptions[0], year: "" });
    const [tripMakingData, setTripMakingData] = useState<ChartData<"doughnut", number[], unknown>>({ labels: [], datasets: [] });
    const [modeShareData, setModeShareData] = useState<ChartData<"doughnut", number[], unknown>>({ labels: [], datasets: [] });
    const [tripChartData, setTripChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [durationChartData, setDurationChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [modeTripChartData, setModeTripChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [modeDurationChartData, setModeDurationChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });

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
            fetchAndFilterData(TravelDataProvider.getInstance(), menuSelectedOptions, selectedYear, weekOption),
            getTotalRowsForYear(TravelDataProvider.getInstance(), selectedYear)
        ]).then(([filteredData, totalRowsForYear]) => {
            let trips = 0, travelDuration = 0, zeroTripMaker = 0, car = 0, transit = 0, walk = 0, bike = 0, other = 0;

            //Segment data
            filteredData.forEach(row => {
                trips += parseFloat(row.tr_all || '0');
                travelDuration += parseFloat(row.tr_all_dur || '0');
                car += parseFloat(row.mode_car || '0');
                transit += parseFloat(row.mode_pt || '0');
                walk += parseFloat(row.mode_walk || '0');
                bike += parseFloat(row.mode_bike || '0');
                other += parseFloat(row.mode_other || '0');
                if (row.zero_trip === '1.0') zeroTripMaker++;
            });

            const averageTrips = filteredData.length > 0 ? trips / filteredData.length : 0;
            const averageTravelDuration = filteredData.length > 0 ? travelDuration / filteredData.length : 0;

            updateSegmentSize(filteredData.length);
            updateSegmentShare(filteredData.length, totalRowsForYear);
            updateSegmentTrips(averageTrips);
            updateSegmentTravel(averageTravelDuration);
            setFilteredData(filteredData);

            // Donut chart data

            const zeroTripMakerPercentage = parseFloat(((zeroTripMaker / filteredData.length) * 100).toFixed(1));
            const tripMakerPercentage = parseFloat((100 - zeroTripMakerPercentage).toFixed(1));

            const carAverage = filteredData.length > 0 ? car / filteredData.length : 0;
            const transitAverage = filteredData.length > 0 ? transit / filteredData.length : 0;
            const walkAverage = filteredData.length > 0 ? walk / filteredData.length : 0;
            const bikeAverage = filteredData.length > 0 ? bike / filteredData.length : 0;
            const otherAverage = filteredData.length > 0 ? other / filteredData.length : 0;

            const averageSum = carAverage + transitAverage + walkAverage + bikeAverage + otherAverage;

            const carPercentage = parseFloat((carAverage / (averageSum) * 100).toFixed(1));
            const transitPercentage = parseFloat((transitAverage / (averageSum) * 100).toFixed(1));
            const walkPercentage = parseFloat((walkAverage / (averageSum) * 100).toFixed(1));
            const bikePercentage = parseFloat((bikeAverage / (averageSum) * 100).toFixed(1));
            const otherPercentage = parseFloat((100 - carPercentage - transitPercentage - walkPercentage - bikePercentage).toFixed(1));


            setTripMakingData({
                labels: ['Trip-maker', 'Zero trip-maker'],
                datasets: [{
                    data: [tripMakerPercentage, zeroTripMakerPercentage],
                    backgroundColor: [Colors.tripMakerDonoutBackground, Colors.zeroTripMakerDonutBackground],
                    borderColor: [Colors.tripMakerDonutBorder, Colors.zeroTripMakerDonutBorder],
                    borderWidth: 1
                }]
            });

            setModeShareData({
                labels: ['Car', 'Transit', 'Walk', 'Bike', 'Other'],
                datasets: [{
                    data: [carPercentage, transitPercentage, walkPercentage, bikePercentage, otherPercentage],
                    backgroundColor: [
                        Colors.carModeShareBackground,
                        Colors.transitModeShareBackground,
                        Colors.walkModeShareBackground,
                        Colors.bikeModeShareBackground,
                        Colors.otherModeShareBackground,
                    ],
                    borderColor: [
                        Colors.carModeShareBorder,
                        Colors.transitModeShareBorder,
                        Colors.walkModeShareBorder,
                        Colors.bikeModeShareBorder,
                        Colors.otherModeShareBorder,
                    ],
                    borderWidth: 1
                }]
            });

            const tripsChartData = prepareChartData(filteredData, 'numberTrip', 'trip');
            const durationChartData = prepareChartData(filteredData, 'durationTrip', 'trip');

            const modeChartData = prepareChartData(filteredData, 'numberTrip', 'travelMode');
            const durationModeChartData = prepareChartData(filteredData, 'durationTrip', 'travelMode');


            setTripChartData(tripsChartData);
            setDurationChartData(durationChartData);
            setModeTripChartData(modeChartData);
            setModeDurationChartData(durationModeChartData);
        }).finally(() => {
            setIsWithinYearLoading(false);
        });
    }, [menuSelectedOptions, yearMenuSelections]);

    return (
        <>
            <div className='home'>
                <YearMenu onSelectionChange={handleYearMenuChange} />
                <div className="travel">
                    <div className="box SegmentSize"><Segment {...segmentSize} />
                        <Infobox>
                            <p>The total number of respondents in the selected segment within the year.</p>
                        </Infobox></div>
                    <div className="box SegmentShare"><Segment {...segmentShare} />
                        <Infobox>
                            <p>The proportion of the selected segment within the total sample for the year.</p>
                        </Infobox></div>
                    <div className="box SegmentTrips"><Segment {...segmentTrips} />
                        <Infobox>
                            <p>Number of trips undertaken per day per person.</p>
                        </Infobox></div>
                    <div className="box SegmentTravelDuration"><Segment {...segmentTravel} />
                        <Infobox>
                            <p>Total time spent on traveling per person per day.</p>
                        </Infobox></div>
                    <div className="box DonutTrip"><Donut
                        title="Trip-making"
                        data={tripMakingData} />
                        <Infobox>
                            <p>The disribution of people who make zero trips in a day vs. those who make trips.</p>
                        </Infobox>
                        </div>
                    <div className="box NumberTripsChartComponent"><ChartComponent
                        chartData={tripChartData}
                        title='Number of trips per person per day by trip purpose'
                        isStacked={false}
                        showLegend={false} />
                        <Infobox>
                            <p>Number of daily trips per person, categorized by trip purpose. Refer to the About page for more details on trip purpose taxonomy.</p>
                        </Infobox></div>
                    <div className="box ModeTripChartAverage"><VerticalStackedBarChart
                        chartData={modeTripChartData}
                        title="Number of trips per person per day by travel mode"
                        isStacked={false}
                        showLegend={false} />
                        <Infobox>
                            <p>Number of daily trips per person, categorized by travel mode. Refer to the About page for more details on travel mode classifications.</p>
                        </Infobox>
                    </div>
                    <div className="box DonutModeShare"><Donut
                        title="Mode share (%)"
                        data={modeShareData} />
                        <Infobox>
                            <p>Mode share distribution. See the About page for more details about mode classifications.</p>
                        </Infobox></div>
                    <div className="box DurationTripsChartComponent"><ChartComponent
                        chartData={durationChartData}
                        title='Daily travel duration per person by trip purpose (min)'
                        isStacked={false}
                        showLegend={false} />
                        <Infobox>
                            <p>Daily travel duration per person, categorized by trip purpose. Refer to the About page for more details on trip purpose taxonomy.</p>
                        </Infobox></div>
                    <div className="box ModeDurationChartAverage"><VerticalStackedBarChart
                        chartData={modeDurationChartData}
                        title="Daily travel duration by person by travel mode (min)"
                        isStacked={false}
                        showLegend={false} />
                        <Infobox>
                            <p>Daily travel duration per person, categorized by travel mode. Refer to the About page for more details on travel mode classifications.</p>
                        </Infobox>
                    </div>

                </div>

            </div>
        </>
    )

}