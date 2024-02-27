import { active } from "d3";
import { ChartDataProps, DataRow, TravelModeOption, TripPurposeOption } from "../Types"
import { TravelModeOptions, TripPurposeOptions } from "../../utils/Helpers";
import { Travel } from "../../pages/Travel";


export const prepareVerticalChartData = (filteredData: DataRow[], optionValue: TripPurposeOption | TravelModeOption, activeOption: string, startYear: string, endYear: string): {
    tripsChartData: ChartDataProps,
    durationChartData: ChartDataProps,
    minYear: string,
    maxYear: string,
    optionChanges: any
} => {

    // Filter data by startYear and endYear
    const filteredByYearData = filteredData.filter(dataRow => {
        const year = dataRow['year'];
        return year >= startYear && year <= endYear;
    });

    let yearlyData: any = {};

    // Compute yearly averages based on activeOption
    filteredByYearData.forEach(dataRow => {
        const year = dataRow['year'];
        if (!yearlyData[year]) {
            yearlyData[year] = { totalTrips: 0, totalDuration: 0, count: 0 };
        }
        yearlyData[year].totalTrips += parseFloat(dataRow[optionValue.numberTrip] || '0');
        yearlyData[year].totalDuration += parseFloat(dataRow[optionValue.durationTrips] || '0');
        yearlyData[year].count++;
    });

    const labels = Object.keys(yearlyData).sort();
    const tripData = labels.map(year => parseFloat((yearlyData[year].totalTrips / (yearlyData[year].count > 0 ? yearlyData[year].count : 1)).toFixed(2)));
    const durationData = labels.map(year => parseFloat((yearlyData[year].totalDuration / (yearlyData[year].count > 0 ? yearlyData[year].count : 1)).toFixed(1)));


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

    // Construct chart data
    const tripsChartData: ChartDataProps = {
        labels,
        datasets: [{
            label: optionValue.label,
            data: tripData,
            borderColor: '#9D83A7',
            backgroundColor: '#9D83A7',
            barThickness: 'flex'
        }]
    };

    const durationChartData: ChartDataProps = {
        labels,
        datasets: [{
            label: optionValue.label,
            data: durationData,
            borderColor: '#6DAFA0',
            backgroundColor: '#6DAFA0',
            barThickness: 'flex'
        }]
    };

    // Compute minYear and maxYear
    const minYear = labels[0];
    const maxYear = labels[labels.length - 1];

    return {
        tripsChartData,
        durationChartData,
        minYear,
        maxYear,
        optionChanges
    };

};