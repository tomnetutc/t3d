import { active } from "d3";
import { ChartDataProps, CountObj, DataRow, SampleSizeTableProps, TravelModeOption, TripPurposeOption } from "../Types"
import { TravelModeOptions, TripPurposeOptions } from "../../utils/Helpers";
import { Travel } from "../../pages/Travel";


export const prepareVerticalChartData = (filteredData: DataRow[], optionValues: (TripPurposeOption | TravelModeOption)[], activeOption: string, startYear: string, endYear: string): {
    tripsChartData: ChartDataProps,
    durationChartData: ChartDataProps,
    minYear: string,
    maxYear: string,
    optionChanges: any,
    sampleSizeTableData: SampleSizeTableProps
} => {

    const tripsColors = ['#9D83A7', '#6DAFA0', '#f9a875', '#ebc823', '#657383'];

    // Filter data by startYear and endYear
    const filteredByYearData = filteredData.filter(dataRow => {
        const year = dataRow['year'];
        return year >= startYear && year <= endYear;
    });

    const uniqueYears = Array.from(new Set(filteredByYearData.map(item => item.year)))
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    let countObj: CountObj = {
        data: filteredByYearData,
        count: []
    };

    // Count the number of rows for each year for the sample size table
    uniqueYears.forEach(year => {
        countObj.count.push([year.toString(), countObj.data.filter(row => row.year === year).length]);
    });

    // Assume optionValue is now an array of options
    let YearDataPerOption: any = {};

    // Initialize data structure for each option
    optionValues.forEach(option => {
        YearDataPerOption[option.label] = {};
    });

    // Aggregate data for each option and year
    filteredByYearData.forEach(dataRow => {
        const year = dataRow['year'];
        optionValues.forEach(option => {
            if (!YearDataPerOption[option.label][year]) {
                YearDataPerOption[option.label][year] = { totalTrips: 0, totalDuration: 0, count: 0 };
            }
            YearDataPerOption[option.label][year].totalTrips += parseFloat(dataRow[option.numberTrip] || '0');
            YearDataPerOption[option.label][year].totalDuration += parseFloat(dataRow[option.durationTrips] || '0');
            YearDataPerOption[option.label][year].count++;
        });
    });

    // Generate labels from the years available in filtered data
    const labels = Object.keys(YearDataPerOption[optionValues[0].label]).sort();

    type ChartDataSet = ChartDataProps['datasets'][number];
    // Prepare chart data for each option
    let tripsChartDataSets: ChartDataSet[] = [];
    let durationChartDataSets: ChartDataSet[] = [];

    optionValues.forEach((option, index) => {

        const colorIndex = index % tripsColors.length;
        const tripBackgroundColor = tripsColors[colorIndex];

        const tripData = labels.map(year => {
            const data = YearDataPerOption[option.label][year];
            return parseFloat((data.totalTrips / (data.count > 0 ? data.count : 1)).toFixed(2));
        });

        const durationData = labels.map(year => {
            const data = YearDataPerOption[option.label][year];
            return parseFloat((data.totalDuration / (data.count > 0 ? data.count : 1)).toFixed(1));
        });

        // Add to datasets for trips and duration charts
        tripsChartDataSets.push({
            label: option.label,
            data: tripData,
            borderColor: tripBackgroundColor,
            backgroundColor: tripBackgroundColor,
            barThickness: 'flex',
        });

        durationChartDataSets.push({
            label: option.label,
            data: durationData,
            borderColor: tripBackgroundColor,
            backgroundColor: tripBackgroundColor,
            barThickness: 'flex',
        });
    });


    const options = activeOption === "Trip purpose" ? TripPurposeOptions : TravelModeOptions;

    // Calculate averages for each option value and year

    let optionYearlyData: any = {};

    // Initialize data structure for each option
    options.forEach(option => {
        optionYearlyData[option.label] = {};

        filteredByYearData.forEach(dataRow => {
            const year = dataRow['year'];
            if (!optionYearlyData[option.label][year]) {
                optionYearlyData[option.label][year] = { totalTrips: 0, totalDuration: 0, count: 0 };
            }
        });
    });

    // Aggregate data for each option and year
    filteredByYearData.forEach(dataRow => {
        const year = dataRow['year'];
        if (year >= startYear && year <= endYear) {
            options.forEach(option => {
                const tripCount = parseFloat(dataRow[option.numberTrip] || '0');
                const duration = parseFloat(dataRow[option.durationTrips] || '0');

                optionYearlyData[option.label][year].totalTrips += tripCount;
                optionYearlyData[option.label][year].totalDuration += duration;
                optionYearlyData[option.label][year].count++;
            });
        }
    });

    // After aggregating data for each option and year, Calculate averages
    let optionAverages: any = {};
    Object.keys(optionYearlyData).forEach(label => {
        optionAverages[label] = { tripData: [], durationData: [] };

        Object.keys(optionYearlyData[label]).forEach(year => {
            const yearData = optionYearlyData[label][year];

            const avgTrips = (yearData.count > 0 ? (yearData.totalTrips / yearData.count) : 0).toFixed(2);
            const avgDuration = (yearData.count > 0 ? (yearData.totalDuration / yearData.count) : 0).toFixed(1);

            optionAverages[label].tripData.push(avgTrips);
            optionAverages[label].durationData.push(avgDuration);
        });
    });

    // Calculate changes and percent changes
    let optionChanges: any = {};
    Object.keys(optionAverages).forEach(label => {
        const tripData = optionAverages[label].tripData;
        const durationData = optionAverages[label].durationData;

        if (tripData.length > 0 && durationData.length > 0) {
            const tripDataChange = tripData[tripData.length - 1] - tripData[0];
            const durationDataChange = durationData[durationData.length - 1] - durationData[0];

            const tripDataPercentChange = (tripDataChange / (tripData[0] == 0 ? 0 : tripData[0])) * 100;
            const durationDataPercentChange = (durationDataChange / (durationData[0] == 0 ? 0 : durationData[0])) * 100;

            optionChanges[label] = {
                tripDataChange: tripDataChange.toFixed(2),
                tripDataPercentChange: typeof tripDataPercentChange === 'number' ? `${tripDataPercentChange.toFixed(1)}%` : tripDataPercentChange,
                durationDataChange: durationDataChange.toFixed(1),
                durationDataPercentChange: typeof durationDataPercentChange === 'number' ? `${durationDataPercentChange.toFixed(1)}%` : durationDataPercentChange,
            };
        }
    });

    const tripsChartData: ChartDataProps = {
        labels,
        datasets: tripsChartDataSets,
    };

    const durationChartData: ChartDataProps = {
        labels,
        datasets: durationChartDataSets,
    };

    const sampleSizeTableData: SampleSizeTableProps = {
        years: labels,
        counts: [countObj],
    };


    return {
        tripsChartData,
        durationChartData,
        minYear: uniqueYears[0],
        maxYear: uniqueYears[uniqueYears.length - 1],
        optionChanges,
        sampleSizeTableData
    };

};