import { ActivityOption, ChartDataProps, CountObj, DataRow, SampleSizeTableProps } from '../Types';
import { calculateYearlyActivityAverages } from '../../utils/Helpers';
import Colors from '../../Colors';

export const prepareVerticalChartData = (filteredData: DataRow[], selectedActivity: ActivityOption, startYear: string, endYear: string): {
    chartData: ChartDataProps, averages: { inHomeAvg: number, outHomeAvg: number }, minYear: string, maxYear: string,
    inHomeChangePercent: number,
    outHomeChangePercent: number,
    inHomeChangeValue: number,
    outHomeChangeValue: number,
    sampleSizeTableData: SampleSizeTableProps
} => {

    // Calculation for Sample Size Table
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

    const yearlyAverages = calculateYearlyActivityAverages(filteredData, selectedActivity, startYear, endYear);
    const labels = yearlyAverages.map(item => item.year);

    // Convert string averages to numbers
    const inHomeData = yearlyAverages.map(item => parseFloat(item.inHomeAvg));
    const outHomeData = yearlyAverages.map(item => parseFloat(item.outHomeAvg));

    // Calculate the overall average
    const inHomeAvg = parseFloat((inHomeData.reduce((a, b) => a + b, 0) / inHomeData.length).toFixed(1));
    const outHomeAvg = parseFloat((outHomeData.reduce((a, b) => a + b, 0) / outHomeData.length).toFixed(1));


    const minYear = labels[0];
    const maxYear = labels[labels.length - 1];

    //Calculate the percentage change
    const calculateChangePercentage = (data: any) => {
        if (data.length > 1) {
            const firstValue = data[0];
            const lastValue = data[data.length - 1];

            return ((lastValue - firstValue) / firstValue) * 100;
        }
        return 0;
    };

    const inHomeChangePercent = calculateChangePercentage(inHomeData);
    const outHomeChangePercent = calculateChangePercentage(outHomeData);

    const inHomeChangeValue = inHomeData.length > 1 ? inHomeData[inHomeData.length - 1] - inHomeData[0] : 0;
    const outHomeChangeValue = outHomeData.length > 1 ? outHomeData[outHomeData.length - 1] - outHomeData[0] : 0;


    const barCountThreshold = 6;

    let barThickness = labels.length <= barCountThreshold ? 50 : 'flex' as 'flex';

    const chartData: ChartDataProps = {
        labels,
        datasets: [
            {
                label: 'In-home',
                data: inHomeData,
                backgroundColor: Colors.inHomeBetweenBackground,
                borderColor: Colors.inHomeBetweenBorder,
                borderWidth: 1,
                barThickness: barThickness
            },
            {
                label: 'Out-of-home',
                data: outHomeData,
                backgroundColor: Colors.outOfHomeBetweenBackground,
                borderColor: Colors.outOfHomeBetweenBorder,
                borderWidth: 1,
                barThickness: barThickness
            }
        ]
    };

    const sampleSizeTableData: SampleSizeTableProps = {
        years: labels,
        counts: [countObj],
    };

    return {
        chartData,
        averages: { inHomeAvg, outHomeAvg },
        minYear,
        maxYear,
        inHomeChangePercent,
        outHomeChangePercent,
        inHomeChangeValue,
        outHomeChangeValue,
        sampleSizeTableData
    };
};
